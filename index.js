const express = require("express");

const sequelize = require("./src/config/database.js");
const User = require("./src/model/userModel.js");
const { generateUserId } = require("./src/utils/commonUtils.js");
const userRoutes = require("./src/routes/userRoutes.js");
const authRoutes = require("./src/routes/authRoutes.js");

const app = express();
app.use(express.json());

sequelize
  .sync
  // {force:true}
  ()
  .then(() => {
    console.log("Database and tables synced!");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

// Use routes
app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
