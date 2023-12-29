const express = require("express");
const authController = require("../controllers/auth-controller");
const authRouter = express.Router();
const registerSchema = require("../validators/auth-validator")
const validate = require("../middleware/validate-middleware");
const authMiddleware = require("../middleware/auth-middleware");

authRouter.route("/register").post( validate(registerSchema),  authController.register);

authRouter.route("/login").post(authController.login);

authRouter.route("/user").get(authMiddleware, authController.user);

module.exports = authRouter;