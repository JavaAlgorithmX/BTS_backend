const nodemailer = require('nodemailer');
const dns = require('dns'); // Import the DNS module

// Create the transport for nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

// Function to validate the email domain
const validateEmailDomain = (email) => {
  return new Promise((resolve, reject) => {
    const domain = email.split('@')[1]; // Extract domain from email address
    dns.resolveMx(domain, (err, addresses) => {
      if (err || addresses.length === 0) {
        reject(new Error("Invalid domain: " + domain)); // No MX records found
      } else {
        resolve(true); // Valid domain with mail servers
      }
    });
  });
};


// const emailConfig = {
//   enquiry: {
//     subject: "Thank You for Your Enquiry",
//     templatePath: "../email/enquiry-email-template.ejs",
//     adminSubject: "New Enquiry Received",
//     adminTemplatePath: "../email/admin-enquiry-email-template.ejs",
//   },
//   course_enquiry_course_details_page: {
//     subject: "Thank You for Your Enquiry About Course",
//     templatePath: "../email/course-enquiry-email-template.ejs",
//     adminSubject: "New Course Enquiry Received",
//     adminTemplatePath: "../email/admin-enquiry-email-template.ejs",
//   },
//   consulting: {
//     subject: "Consulting Slot Confirmation",
//     templatePath: "../email/consulting-slot-booking-email-template.ejs",
//     adminSubject: "New Consulting Slot Booking",
//     adminTemplatePath: "../email/admin-consulting-email-template.ejs",
//   },
//   contact_us_home: {
//     subject: "Thank You for Contacting Us",
//     templatePath: "../email/get-in-touch-home-email-template.ejs",
//     adminSubject: "New Contact Enquiry (Home Page)",
//     adminTemplatePath: "../email/admin-enquiry-email-template.ejs",
//   },
//   contact_us_projects: {
//     subject: "Thank You for Your Enquiry",
//     templatePath: "../email/get-in-touch-project-email-template.ejs",
//     adminSubject: "New Contact Enquiry (Projects Page)",
//     adminTemplatePath: "../email/admin-enquiry-email-template.ejs",
//   },
//   contact_us_products: {
//     subject: "Thank You for Your Enquiry",
//     templatePath: "../email/get-in-touch-products-email-template.ejs",
//     adminSubject: "New Contact Enquiry (Products Page)",
//     adminTemplatePath: "../email/admin-enquiry-email-template.ejs",
//   },
//   About_us: {
//     subject: "Thank You for Your Enquiry",
//     templatePath: "../email/get-in-touch-about-us.ejs",
//     adminSubject: "New Contact Enquiry (About Us Page)",
//     adminTemplatePath: "../email/admin-enquiry-email-template.ejs",
//   },
// };
const path = require('path');

const emailConfig = {
  enquiry: {
    subject: "Thank You for Your Enquiry",
    templatePath: path.join(__dirname, "email", "enquiry-email-template.ejs"),
    adminSubject: "New Enquiry Received",
    adminTemplatePath: path.join(__dirname, "email", "admin-enquiry-email-template.ejs"),
  },
  course_enquiry_course_details_page: {
    subject: "Thank You for Your Enquiry About Course",
    templatePath: path.join(__dirname, "email", "course-enquiry-email-template.ejs"),
    adminSubject: "New Course Enquiry Received",
    adminTemplatePath: path.join(__dirname, "email", "admin-enquiry-email-template.ejs"),
  },
  consulting: {
    subject: "Consulting Slot Confirmation",
    templatePath: path.join(__dirname, "email", "consulting-slot-booking-email-template.ejs"),
    adminSubject: "New Consulting Slot Booking",
    adminTemplatePath: path.join(__dirname, "email", "admin-consulting-email-template.ejs"),
  },
  contact_us_home: {
    subject: "Thank You for Contacting Us",
    templatePath: path.join(__dirname, "email", "get-in-touch-home-email-template.ejs"),
    adminSubject: "New Contact Enquiry (Home Page)",
    adminTemplatePath: path.join(__dirname, "email", "admin-enquiry-email-template.ejs"),
  },
  contact_us_projects: {
    subject: "Thank You for Your Enquiry",
    templatePath: path.join(__dirname, "email", "get-in-touch-project-email-template.ejs"),
    adminSubject: "New Contact Enquiry (Projects Page)",
    adminTemplatePath: path.join(__dirname, "email", "admin-enquiry-email-template.ejs"),
  },
  contact_us_products: {
    subject: "Thank You for Your Enquiry",
    templatePath: path.join(__dirname, "email", "get-in-touch-products-email-template.ejs"),
    adminSubject: "New Contact Enquiry (Products Page)",
    adminTemplatePath: path.join(__dirname, "email", "admin-enquiry-email-template.ejs"),
  },
  About_us: {
    subject: "Thank You for Your Enquiry",
    templatePath: path.join(__dirname, "email", "get-in-touch-about-us.ejs"),
    adminSubject: "New Contact Enquiry (About Us Page)",
    adminTemplatePath: path.join(__dirname, "email", "admin-enquiry-email-template.ejs"),
  },
};



const sendEmail = async (req, res) => {
  const { formType, userData } = req.body;
  
  if (!formType || !emailConfig[formType]) {
    return res.status(400).send("Invalid form type.");
  }

  if (!userData) {
    return res.status(400).send("User data is missing.");
  }

  //const { subject, templatePath } = emailConfig[formType];
  const { subject, templatePath, adminSubject, adminTemplatePath } = emailConfig[formType];

  let email, name, message, selectedDate, bookingType, mobile;

  if (formType === "consulting") {
    ({ email, name, message, selectedDate, bookingType, mobile } = userData);
  } else {
    ({ email, name, message, mobile } = userData);
    
  }


  try {
    await validateEmailDomain(email);

    // Verify the connection configuration
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Server is ready to take our messages");
          resolve(success);
        }
      });
    });

    // Compile EJS template
    const ejs = require('ejs');
    const fs = require('fs');
    const path = require('path');
// user mail
    const user_template = fs.readFileSync(path.resolve(__dirname, templatePath), 'utf-8');
    const userHtmlContent = ejs.render(user_template, { name, message,bookingType,selectedDate, mobile });


    const userEmailInfo = await transporter.sendMail({
      from: {
        name: "BRAINONETECH",
        address: process.env.EMAIL,
      },
      to: email, // User's email
      subject,
      html: userHtmlContent,
    });

    console.log('User email sent:', userEmailInfo.response);



    // Admin Email Content
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const adminTemplate = fs.readFileSync(path.resolve(__dirname, adminTemplatePath), 'utf-8');
      const adminHtmlContent = ejs.render(adminTemplate, { 
        name, email, mobile, message, bookingType, selectedDate, formType 
      });

      const adminEmailInfo = await transporter.sendMail({
        from: {
          name: "BRAINONETECH",
          address: process.env.EMAIL,
        },
        to: adminEmail,
        subject: adminSubject,
        html: adminHtmlContent,
      });

      console.log('Admin email sent:', adminEmailInfo.response);
    } else {
      console.warn('Admin email is not set in environment variables.');
    }
    res.send('Email sent successfully');
  } catch (error) {
    // Handle specific error cases
    if (error.message && error.message.includes("Invalid domain")) {
      console.error('Invalid domain:', error);
      res.status(400).send("Invalid domain: The email address cannot be sent to this domain.");
    } else if (error.code === 'EENVELOPE') {
      // Invalid email address format
      console.error('Invalid email address format:', error);
      res.status(400).send("Invalid email address format");
    } else if (error.responseCode === 550) {
      // Recipient email address doesn't exist (bounced email)
      console.error('Recipient email address does not exist:', error);
      res.status(400).send("Recipient email address does not exist");
    } else {
      // General server error
      console.error('Error sending email:', error);
      res.status(500).send("Internal Server Error");
    }
  }
};

module.exports = {
  sendEmail,
};


//=====================================================================================
// const nodemailer = require('nodemailer');
// const dns = require('dns');
// const ejs = require('ejs');
// const fs = require('fs');
// const path = require('path');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.APP_PASSWORD,
//   },
// });

// const ADMIN_EMAIL = process.env.ADMIN_EMAIL; // Set this in your environment variables

// const validateEmailDomain = (email) => {
//   return new Promise((resolve, reject) => {
//     const domain = email.split('@')[1];
//     dns.resolveMx(domain, (err, addresses) => {
//       if (err || addresses.length === 0) {
//         reject(new Error("Invalid domain: " + domain));
//       } else {
//         resolve(true);
//       }
//     });
//   });
// };

// const sendEmail = async (req, res) => {
//   const { formType, userData } = req.body;
  
//   if (!formType || !emailConfig[formType]) {
//     return res.status(400).send("Invalid form type.");
//   }

//   if (!userData) {
//     return res.status(400).send("User data is missing.");
//   }

//   const { subject, templatePath, adminSubject, adminTemplatePath } = emailConfig[formType];
//   let email, name, message, selectedDate, bookingType, mobile;

//   if (formType === "consulting") {
//     ({ email, name, message, selectedDate, bookingType, mobile } = userData);
//   } else {
//     ({ email, name, message, mobile } = userData);
//   }

//   try {
//     await validateEmailDomain(email);

//     await new Promise((resolve, reject) => {
//       transporter.verify((error, success) => {
//         if (error) {
//           console.log(error);
//           reject(error);
//         } else {
//           console.log("Server is ready to take our messages");
//           resolve(success);
//         }
//       });
//     });

//     // **Send User Email**
//     const userTemplatePath = path.join(__dirname, templatePath);
//     const userTemplate = fs.readFileSync(userTemplatePath, 'utf-8');
//     const userHtmlContent = ejs.render(userTemplate, { name, message, bookingType, selectedDate, mobile });

//     await transporter.sendMail({
//       from: {
//         name: "BRAINONETECH",
//         address: process.env.EMAIL,
//       },
//       to: email, // User Email
//       subject,
//       html: userHtmlContent,
//     });

//     console.log("User email sent successfully!");

//     // **Send Admin Email**
//     if (ADMIN_EMAIL) {
//       const adminTemplatePath = path.join(__dirname, adminTemplatePath);
//       const adminTemplate = fs.readFileSync(adminTemplatePath, 'utf-8');
//       const adminHtmlContent = ejs.render(adminTemplate, { name, message, bookingType, selectedDate, mobile, email, formType });

//       await transporter.sendMail({
//         from: {
//           name: "BRAINONETECH",
//           address: process.env.EMAIL,
//         },
//         to: ADMIN_EMAIL, // Admin Email
//         subject: adminSubject,
//         html: adminHtmlContent,
//       });

//       console.log("Admin email sent successfully!");
//     }

//     res.send("Emails sent successfully");
//   } catch (error) {
//     if (error.message && error.message.includes("Invalid domain")) {
//       console.error("Invalid domain:", error);
//       res.status(400).send("Invalid domain: The email address cannot be sent to this domain.");
//     } else if (error.code === "EENVELOPE") {
//       console.error("Invalid email address format:", error);
//       res.status(400).send("Invalid email address format");
//     } else if (error.responseCode === 550) {
//       console.error("Recipient email address does not exist:", error);
//       res.status(400).send("Recipient email address does not exist");
//     } else {
//       console.error("Error sending email:", error);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// };

// module.exports = {
//   sendEmail,
// };

