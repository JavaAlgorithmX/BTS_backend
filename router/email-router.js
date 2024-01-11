// routes/emailRoutes.js
const express = require('express');
const emailController = require('../controllers/email-controller');

const router = express.Router();

// router.post('/send-email', async (req, res) => {
//   const { to, subject, text } = req.body;

//   try {
//     const result = await emailController.sendEmail(to, subject, text);
//     res.send(result);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

router.post('/send-email', emailController.sendEmail);

module.exports = router;
