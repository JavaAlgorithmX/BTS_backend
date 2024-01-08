// const mongoose = require("mongoose");

// const courseSchema = new mongoose.Schema({
//     courseName:{
//         type:String,
//         require:true,
//     },
//     actualPrice:{
//         type:String,
//         require:true,
//     },
//     offerPrice:{
//         type:String,
//         require:true,
//     },
// })

// //define the model or collection name
// const Course = new mongoose.model("Course",courseSchema);

// module.exports = Course;



const User = require("../models/user-model");

const mongoose = require('mongoose');

// Subschema for Course Structure
const subTopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  // Add more fields as needed
});

const mainTopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subTopics: [subTopicSchema],
  // Add more fields as needed
});

const batchSchema = new mongoose.Schema({
    startDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['running', 'completed', 'upcoming'], // Add more statuses if needed
      default: 'upcoming',
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    enrolledStudents: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        enrollmentDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  });

  
  const ratingSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now,
    },
  });

  const courseSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      // Add more fields as needed
    },
    structure: [mainTopicSchema],
    batches: [batchSchema],
    ratings: [ratingSchema],
  });

  //methods for course
  courseSchema.statics.createCourse = async function (courseData) {
    try {
      const newCourse = await this.create(courseData);
      return newCourse;
    } catch (error) {
      throw new Error(`Error creating course: ${error.message}`);
    }
  };

  courseSchema.statics.addBatch = async function (courseId, batchData) {
    try {
      const course = await this.findById(courseId);
      course.batches.push(batchData);
      await course.save();
      return course;
    } catch (error) {
      throw new Error(`Error adding batch: ${error.message}`);
    }
  };

  courseSchema.statics.enrollStudent = async function (courseId, batchId, studentId) {
    try {
      const course = await this.findById(courseId);
      console.log("course -> ",course);
  
      if (!course) {
        throw new Error('Course not found');
      }
  
      // Find the batch by BatchId
      const batch = course.batches.find(b => b._id.toString() === batchId);
  
      if (!batch) {
        throw new Error('Batch not found');
      }
  
      // Check if the student is already enrolled in the batch
      // const isEnrolled = batch.enrolledStudents.some(student => student.userId.toString() === studentId);
  
      // if (isEnrolled) {
      //   throw new Error('Student is already enrolled in the batch');
      // }
  
      // Enroll the student in the batch
      const enrollmentDate = new Date();
      // batch.enrolledStudents.push({ userId: studentData.userId, enrollmentDate });
      batch.enrolledStudents.push({ userId: studentId, enrollmentDate });
  
      await course.save();
      return course;
    } catch (error) {
      throw new Error(`Error enrolling student: ${error.message}`);
    }
  };

  courseSchema.statics.addMainTopic = async function (courseId, mainTopicData) {
    try {
      const course = await this.findById(courseId);
      course.structure.push(mainTopicData);
      await course.save();
      return course;
    } catch (error) {
      throw new Error(`Error adding main topic: ${error.message}`);
    }
  };

courseSchema.statics.addSubTopic = async function (courseId, mainTopicId, subTopicData) {
  try {
    const course = await this.findById(courseId);

    // Find the main topic by its id
    const mainTopic = course.structure.find(topic => topic._id.toString() === mainTopicId);

    // Assuming you have a validation logic to ensure mainTopic is present and is an object
    if (!mainTopic || typeof mainTopic !== 'object') {
      throw new Error('Invalid main topic id.');
    }
    console.log("subTopic data ->",subTopicData)
    mainTopic.subTopics.push(subTopicData);
    await course.save();
    return course;
  } catch (error) {
    throw new Error(`Error adding sub-topic: ${error.message}`);
  }
};

  courseSchema.statics.addRating = async function (courseId, ratingData) {
    try {
      const course = await this.findById(courseId);
      course.ratings.push(ratingData);
      await course.save();
      return course;
    } catch (error) {
      throw new Error(`Error adding rating: ${error.message}`);
    }
  };

  courseSchema.statics.getEnrolledStudentsOfBatch = async function (courseId, batchId) {
    try {
      const course = await this.findById(courseId);
  
      if (!course) {
        throw new Error('Course not found');
      }
  
      // Find the batch by BatchId
      const batch = course.batches.find(b => b._id.toString() === batchId);
  
      if (!batch) {
        throw new Error('Batch not found');
      }
  
      // Retrieve user information for enrolled students
      const enrolledStudents = await User.find({ _id: { $in: batch.enrolledStudents.map(student => student.userId) } });
  
      // Combine user information with enrollment details
      const enrolledStudentsWithDetails = batch.enrolledStudents.map(enrollment => {
        const user = enrolledStudents.find(u => u._id.toString() === enrollment.userId.toString());
        return {
          userId: enrollment.userId,
          username: user ? user.name : 'N/A', // Add other user details as needed
          email: user.email,
          mobile:user.mobile,
          enrollmentDate: enrollment.enrollmentDate,
        };
      });
  
      return enrolledStudentsWithDetails;
    } catch (error) {
      throw new Error(`Error getting enrolled students: ${error.message}`);
    }
  };
  
  const Course = mongoose.model('Course', courseSchema);
  
  module.exports = Course;
