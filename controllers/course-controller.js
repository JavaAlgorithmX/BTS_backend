const Course = require("../models/course-model");

const create = async (req, res)=>{
    try{
        const {courseName, actualPrice, offerPrice} = req.body;

        const isCourseExist = await Course.findOne({courseName});
        
        if(isCourseExist){
            return res.status(400).json({message:`Course: ${courseName} already exists in our system`});
        }

        const courseCreated = await Course.create({courseName, actualPrice, offerPrice});
        res.status(200).json(courseCreated);

    }catch(error){
        console.log(error);
    }
}

const getCourse = async (req, res)=>{
    try{
        const courses = await Course.find({});
        res.status(200).json(courses);

    }catch(error){
        console.log(error);
    }
}

const getCourseById = async (req, res)=>{
    const { id } = req.params;
    try{
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({  error: 'Course not found' });
          }
        res.status(200).json(course);

    }catch(error){
        console.log(error);
    }
}

const getCourseCount = async (req, res) => {
    try {
        const courseCount = await Course.countDocuments({});
        res.status(200).json(courseCount);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = { create ,getCourse ,getCourseById , getCourseCount}