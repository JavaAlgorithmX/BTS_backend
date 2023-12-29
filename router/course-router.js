const express = require("express");
const courseController = require("../controllers/course-controller");
const courseRouter = express.Router();

courseRouter.route("/create").post(courseController.create);

module.exports = courseRouter;