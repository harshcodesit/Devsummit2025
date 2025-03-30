const mongoose  = require("mongoose");
const schema = mongoose.Schema;



const dreamSchema = new schema({
    title: { type: String, required: true, trim: true, maxlength: 100 }, 
    description: { type: String, required: true, trim: true },
    tags: [{ type: String }],
    imageUrl: { type: String, default: "https://i.postimg.cc/XY7VQS90/temoer.jpg" }, 
    upvotes: { type: Number, default: 0 }, // Tracks number of upvotes
    
});             

module.exports = mongoose.model("Dream",dreamSchema);