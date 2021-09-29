const mongoose = require("mongoose");

const NoticeBoard = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
 
});

const Notice = mongoose.model("Notice", NoticeBoard);
module.exports = Notice;
