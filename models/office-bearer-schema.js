const mongoose = require("mongoose");

const OfficeBearerContact = mongoose.Schema({
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
  }

});

const OfficeBearer = mongoose.model("OfficeBearer", OfficeBearerContact);
module.exports = OfficeBearer;
