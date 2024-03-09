const Enquiry = require('../models/enquiry-model'); // Adjust the path based on your file structure
// const transporter = require('../controllers/email-controller')
const { sendEmail, transporter } = require('../controllers/email-controller');
// const {confirmationTem} = require('../email/en');
const ejs = require('ejs');
const fs = require('fs');
// const tamplate = require("../email/")

// email\enquiry-confirmation-tamplate.ejs

// Create a new enquiry
exports.createEnquiry = async (req, res) => {
    console.log(req.body);
  const enquiry = new Enquiry(req.body);
  try {
    const savedenquiry = await enquiry.save();

    sendConfirmationEmail(enquiry.email,'Enquiry Submitted Successfully', enquiry);
    sendEnquiryNotificationEmail('mastermadhav001@gmail.com', 'New Enquiry Recieved', enquiry);
    res.status(201).json(enquiry);
  } catch (error) {
    res.status(500).json({ error: 'Error creating enquiry' });
    console.log(error)
  }
};

async function sendConfirmationEmail(email, subject, enquiry) {
  
    try {
      // const templatePath = 'D:/BrainOneTech/Website/backend/BTS_backend/email/enquiry-confirmation-tamplate.ejs'; // Update with the actual path
      const templatePath1 = '../email/enquiry-confirmation-tamplate.ejs'; // Update with the actual path
      const templateContent = fs.readFileSync(templatePath, 'utf-8');
  
      const formattedMessage = await ejs.render(templateContent, { name: enquiry.name, message: enquiry.message });
  
      const mailOptions = {
        from: transporter.options.auth.user,
        to: email,
        subject: subject,
        text: formattedMessage
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending confirmation email:', error);
        } else {
          console.log('Confirmation Email sent:', info.response);
        }
      });
    } catch (error) {
      console.error('Error rendering email template:', error);
    }
   
  }
  
  // Function to send notification email to admin
  async function sendEnquiryNotificationEmail(adminEmail, subject, enquiry) {
    try {
      // const templatePath = 'D:/BrainOneTech/Website/backend/BTS_backend/email/enquiry-notification-tamplate.ejs'; // Update with the actual path
      const templatePath = '../email/enquiry-notification-tamplate.ejs'; // Update with the actual path
      const templateContent = fs.readFileSync(templatePath, 'utf-8');
  
      const formattedMessage = await ejs.render(templateContent, {
        name: enquiry.name,
        email: enquiry.email,
        mobile: enquiry.mobile,
        message: enquiry.message
      });
  
      const mailOptions = {
        from: transporter.options.auth.user,
        to: adminEmail,
        subject: subject,
        text: formattedMessage
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending notification email:', error);
        } else {
          console.log('Notification Email sent:', info.response);
        }
      });
    } catch (error) {
      console.error('Error rendering notification email template:', error);
    }
  }

// Get all enquiries
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find();
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching enquiries' });
  }
};

// Update an enquiry by ID
exports.updateEnquiry = async (req, res) => {
  const { id } = req.params;
  const { assignedTo, status, result } = req.body;

  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { assignedTo, status, result },
      { new: true }
    );

    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ error: 'Error updating enquiry' });
  }
};
