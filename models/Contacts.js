const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  supportDepartment: {
    type: String,
    required: true,
  },

  appealHeader: {
    type: String,
    required: true,
  },
  msg: {
    type: String,
    required: true,
  },
  
}, {timestamps: true});

module.exports = Contact = mongoose.model('Contact', ContactSchema )

