require("dotenv").config();// must be first line if we want to use dot env file
const express = require("express");
const app = express();
const authRouter = require("./router/auth-router");
const courseRouter = require("./router/course-router");
const connectDB = require("./utils/db");
const errorMiddleware = require("./middleware/error-middleware");
const cors = require("cors");
const blogRouter = require("./router/blog-router");


//Middle ware to accept json formet
app.use(cors());  
app.use(express.json());



app.use("/api/auth", authRouter);
app.use("/api/course",courseRouter);
app.use("/api/blog",blogRouter)
// app.use("/",(req,res)=>{
//   return res.status(200).json({"message": "Hello"})
// })

//error middle ware
app.use(errorMiddleware);

const PORT = 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
