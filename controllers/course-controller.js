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

module.exports = { create }