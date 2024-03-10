const Enquiry = require("../models/enquiry-model");
const { sendEmail, transporter } = require("../controllers/email-controller");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const { log } = require("console");

// Create a new enquiry
exports.createEnquiry = async (req, res) => {
  console.log(req.body);
  const enquiry = new Enquiry(req.body);
  try {
    console.log(process.env.EMAIL);
    console.log(process.env.APP_PASSWORD);
    
    const confirmationMail = await sendConfirmationEmail(
      enquiry.email,
      "Enquiry Submitted Successfully",
      enquiry
    );
    
    const notificationMail = await  sendEnquiryNotificationEmail(
      "mastermadhav001@gmail.com",
      "New Enquiry Recieved",
      enquiry
    );
    const savedenquiry = await enquiry.save();
    res.status(201).json(enquiry);
  } catch (error) {
    res.status(500).json({ error: "Error creating enquiry" });
    console.log(error);
  }
};

async function sendConfirmationEmail(email, subject, enquiry) {
  console.log("inside send confirmation mail");

  try {
    const templatePath = path.join(
      __dirname,
      "../email/enquiry-confirmation-tamplate.ejs"
    );
    const templateContent = fs.readFileSync(templatePath, "utf-8");
    const formattedMessage = ejs.render(templateContent, {
      name: enquiry.name,
      message: enquiry.message,
    });
    const mailOptions = {
      from: transporter.options.auth.user,
      to: email,
      subject: subject,
      text: formattedMessage,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      console.log("hello")
      if (error) {
        console.error("Error sending confirmation email:", error);
      } else {
        console.log("Confirmation Email sent:", info.response);
      }
    });
  } catch (error) {
    console.error("Error rendering email template:", error);
  }
}

// Function to send notification email to admin
async function sendEnquiryNotificationEmail(adminEmail, subject, enquiry) {
  try {
    const templatePath = path.join(
      __dirname,
      "../email/enquiry-notification-tamplate.ejs"
    );
    const templateContent = fs.readFileSync(templatePath, "utf-8");
    const formattedMessage = ejs.render(templateContent, {
      name: enquiry.name,
      email: enquiry.email,
      mobile: enquiry.mobile,
      message: enquiry.message,
    });
    const mailOptions = {
      from: transporter.options.auth.user,
      to: adminEmail,
      subject: subject,
      text: formattedMessage,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending notification email:", error);
      } else {
        console.log("Notification Email sent:", info.response);
      }
    });
  } catch (error) {
    console.error("Error rendering notification email template:", error);
  }
}
// Get all enquiries
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find();
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ error: "Error fetching enquiries" });
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
    res.status(500).json({ error: "Error updating enquiry" });
  }
};
