require("dotenv").config();// must be first line if we want to use dot env file
const express = require("express");
const app = express();
const path = require('path'); // Import the path module

const cors = require("cors");
const emailRoutes = require('./router/email-router');
// Serve static files from "public" folder
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get("/logo", (req, res) => {
  const logoPath = path.join(__dirname, "public/image/logo1.png");
  res.sendFile(logoPath);
});


//Middle ware to accept json format
app.use(cors());
app.use(express.json());

app.use('/api/email', emailRoutes);

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
