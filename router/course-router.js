const express = require("express");
const courseController = require("../controllers/course-controller");
const authMiddleware = require("../middleware/auth-middleware");
const courseRouter = express.Router();

// courseRouter.route("/create").post(
//     // authMiddleware, 
//     courseController.create);
courseRouter.route("/").get(courseController.getCourse);
courseRouter.route("/:id").get(courseController.getCourseById);
courseRouter.route("/:id/main-topics").post(courseController.addMainTopics);
courseRouter.route("/:id/:maintopicid/sub-topics").post(courseController.addSubTopics);
courseRouter.route("/:id/batches").post(courseController.addBatch);

courseRouter.route('/:id/:batchId/enroll').post(authMiddleware, courseController.enrollStudentInBatch);
courseRouter.route('/:id/:batchId/enrolled-students').get(authMiddleware, courseController.enrolledStudentsOfBatchList);

//Excel create course
courseRouter.route("/create").post(courseController.createFromExcel);

// courseRouter.route("/count").get(courseController.getCourseCount);


module.exports = courseRouter;