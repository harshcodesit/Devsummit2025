const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Dream = require("./models/dream");
const User = require("./models/user");
const passport = require("passport");
const session = require("express-session");
const localstrat = require("passport-local");




const ejsMate = require("ejs-mate");
const path = require("path");

const sessionOpt = {
    secret: "secret",
    resave : false,
    saveUninitialized : true,
    cookie : {
      expires: Date.now() + (7*24*60*60*100),
      maxAge: 7*24*60*60*100,
      httpOnly: true
    }
  }
  app.use(express.static(__dirname + '/public'))
app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')));
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')));
  app.use(session(sessionOpt));
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new localstrat(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());




app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/solo');};
    main().then(()=>{
      console.log("connection successful")
  }).catch(err => console.log(err));


app.get("/",(req,res)=>{
    res.render("home.ejs")
});

app.get("/signup",(req,res)=>{
    res.render("signup.ejs")
  });
 

  app.post("/signup",async (req,res)=>{
    
    try{
      let {username, email, password} = req.body;
    const newUser = new User({email,username});
    let fobo = await User.register(newUser, password);
    console.log(fobo);
    res.redirect("/login")
    }catch(e){
      res.send(e)
    }
    });
    app.get("/login",(req,res)=>{
        res.render("login.ejs")
      });
      
        app.post("/login",passport.authenticate("local",{failureRedirect: "/signup/login",failureFlash: true}),
      async(req,res)=>{
        res.send("you are loged in")
      });

app.get("/submit",async (req,res)=>{
    const dreams = await Dream.find(); 
    res.render("feed.ejs", { dreams }); 
})
app.get("/dream",async (req,res)=>{
   
        res.render("dream.ejs")    
})
app.get("/battle",async (req,res)=>{
   
    res.render("battle.ejs")    
})

app.post("/submit", async (req, res) => {
    const { title, description, tags, imageUrl  } = req.body;
    const tagsArray = tags ? tags.split(",").map(tag => tag.trim()) : []; // Convert to array

    const newDream = new Dream({
        title,
        description,
        tags: tagsArray,
        imageUrl: imageUrl 
    });
    
    await newDream.save();
    res.redirect("/submit");
});




async function deleteAllDreams() {
    await Dream.deleteMany({});
    console.log("All dreams deleted successfully!");
}
app.get("/lol",(req,res)=>{
    deleteAllDreams();
})

















  app.listen(3000, ()=>{
    console.log("port is listening")
});