const express = require("express");
const courseController = require("../controllers/course-controller");
const authMiddleware = require("../middleware/auth-middleware");
const courseRouter = express.Router();

courseRouter.route("/create").post(authMiddleware, courseController.create);
courseRouter.route("/").get(courseController.getCourse);
courseRouter.route("/:id").get(courseController.getCourseById);
courseRouter.route("/count").get(courseController.getCourseCount);


module.exports = courseRouter;