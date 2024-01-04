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





// const mongoose = require('mongoose');

// // Subschema for Course Structure
// const subTopicSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   // Add more fields as needed
// });

// const mainTopicSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   subTopics: [subTopicSchema],
//   // Add more fields as needed
// });

// // Main Course Schema
// const courseSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   image: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     // Add more fields as needed
//   },
//   structure: [mainTopicSchema],
//   batches: [
//     {
//       startDate: {
//         type: Date,
//         required: true,
//       },
//       endDate: {
//         type: Date,
//       },
//       capacity: {
//         type: Number,
//         required: true,
//       },
//       enrolledStudents: [
//         {
//           studentId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Student',
//           },
//           enrollmentDate: {
//             type: Date,
//             default: Date.now,
//           },
//         },
//       ],
//     },
//   ],
//   ratings: [
//     {
//       studentId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Student',
//       },
//       rating: {
//         type: Number,
//         required: true,
//       },
//       comment: {
//         type: String,
//       },
//       date: {
//         type: Date,
//         default: Date.now,
//       },
//     },
//   ],
// });

// // Course model
// const Course = mongoose.model('Course', courseSchema);

// module.exports = Course;
