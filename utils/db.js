const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI;

const connectDB = async ()=>{
    try {
        await mongoose.connect(URI); 
        console.log("connected to db successfully"); 

    } catch (error) {
        console.error("DB Connection failed");
        process.exit(0);
    }
}

module.exports = connectDB;