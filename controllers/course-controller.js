const Course = require("../models/course-model");
const { ObjectId } = require("mongodb");
const {updateOrCreateCourseFromExcel} = require("../utils/excelFileUpload")
const xlsx = require('xlsx');


const create = async (req, res) => {
  try {
    const { name } = req.body;

    const isCourseExist = await Course.findOne({ name });

    if (isCourseExist) {
      return res
        .status(400)
        .json({
          message: `Course: ${courseName} already exists in our system`,
        });
    }

    const courseCreated = await Course.create(req.body);
    res.status(200).json(courseCreated);
  } catch (error) {
    console.log(error);
  }
};

const addMainTopics = async (req, res) => {
  const { id } = req.params;
  const { mainTopicData } = req.body;
  const objectId = new ObjectId(id);

  try {
    const course = await Course.findOne(objectId);
    course.structure.push(mainTopicData);
    const mainTopic = await course.save();
    res.status(200).json({ msg: mainTopic });
    return course;
  } catch (error) {
    res.status(500).json({ error: error.message });
    throw new Error(`Error adding main topic: ${error.message}`);
  }
};

const addSubTopics = async (req, res) => {
  const { id, maintopicid } = req.params;

  const { subTopicData } = req.body;
  console.log(subTopicData);
  const courseId = new ObjectId(id);
  try {
    const subTopics = await Course.addSubTopic(courseId,maintopicid,subTopicData);
    console.log(subTopics);
    res.status(200).json(subTopics);
  } catch (error) {
    res.status(500).json({ error: error.message });
    throw new Error(`Error adding batch: ${error.message}`);
  }

 
};

const addBatch = async (req, res) => {
  const { id } = req.params;
  const { batchData } = req.body;
  const courseId = new ObjectId(id);
  try {
    const batch = await Course.addBatch(courseId, batchData);
    res.status(200).json({ msg: batch });
  } catch (error) {
    res.status(500).json({ error: error.message });
    throw new Error(`Error adding batch: ${error.message}`);
  }
};

const getCourse = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json(courses);
  } catch (error) {
    console.log(error);
  }
};

const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    console.log(error);
  }
};

//need to check for enrolled students not getting enrolled again
const enrollStudentInBatch = async (req, res) => {
  const { id, batchId } = req.params;
  const student = req.user.id;
  console.log("student -> ",student);

  try {
    const updatedCourse = await Course.enrollStudent(id, batchId, student);
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const enrolledStudentsOfBatchList = async (req, res) => {
    const { id, batchId } = req.params;
    console.log("courseId->",id);
    console.log("batchId->",batchId);
    try {
        // Call the static method from your Course model
        const enrolledStudents = await Course.getEnrolledStudentsOfBatch(id, batchId);
        res.status(200).json(enrolledStudents);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
};

const createFromExcel = async (req, res) => {
  try {
    console.log(req.body);
    const {data} = req.body;

    const result = await updateOrCreateCourseFromExcel(data);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  create,
  getCourse,
  getCourseById,
  addMainTopics,
  addSubTopics,
  addBatch,
  enrollStudentInBatch,
  enrolledStudentsOfBatchList,
  createFromExcel
};
