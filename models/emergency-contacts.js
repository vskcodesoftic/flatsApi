const mongoose = require("mongoose");

const EmergencyContact = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  ContactNumber: {
    type: Number,
    required: true,
  },
  designation: {
    type: String,
  },
  BlockNumber: {
    type: Number,
    required: true,
  },
  FlatNumber: {
    type: Number,
    required: true,
  },
});

const Emergency = mongoose.model("Emergency", EmergencyContact);
module.exports = Emergency;
