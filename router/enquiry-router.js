const express = require('express');
const enquiryController = require('../controllers/enquiry-controller'); // Adjust the path based on your file structure

const router = express.Router();

// Routes for Enquiries
router.post('/enquiries', enquiryController.createEnquiry);
// router.get('/enquiries', enquiryController.getAllEnquiries);
// router.put('/enquiries/:id', enquiryController.updateEnquiry);

module.exports = router;
