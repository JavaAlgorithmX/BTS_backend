const mongoose = require('mongoose');
const User = require("../models/user-model");

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'in progress', 'resolved'],
    default: 'pending'
  },
  result: {
    type: String,
    enum: ['in queue', 'success', 'failed'],
    default: 'in queue'
  }
},
{
  timestamps: true // Automatically add createdAt and updatedAt timestamps
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);

module.exports = Enquiry;
