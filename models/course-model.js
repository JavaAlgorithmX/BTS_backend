const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        require:true,
    },
    actualPrice:{
        type:String,
        require:true,
    },
    offerPrice:{
        type:String,
        require:true,
    },
})

//define the model or collection name
const Course = new mongoose.model("Course",courseSchema);

module.exports = Course;