// controllers/emailController.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL ,
    pass: process.env.APP_PASSWORD
  },
});

const sendEmail = async (req, res) => {
    const { to, subject, text } = req.body;
  
    try {
      const info = transporter.sendMail({
        from:{
            name:"BRAINONETECH",
            address:process.env.EMAIL,
        } ,
        to,
        subject,
        text,
      });
  
      console.log('Email sent:', info.response);
      res.send('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Internal Server Error');
    }
  };

// const sendEmail = async (to, subject, text) => {
//   try {
//     const info = transporter.sendMail({
//       from: {
//         name: "BRAINONETECH",
//         address: process.env.EMAIL,
//       },
//       to,
//       subject,
//       text,
//     });
//     console.log('Email sent:', info.response);
//     return 'Email sent successfully';
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw new Error('Internal Server Error');
//   }
// };

module.exports = {
  sendEmail,
  transporter, // export transporter for use in other files
};