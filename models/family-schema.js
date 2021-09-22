const mongoose = require("mongoose");

const FamilyMemberSchema = mongoose.Schema(
  {
    flatno: {
      type: String,
      required: true,
    },
    BlockNumber: {
      type: String,
      required: true,
    },
    flatOwnerName: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    Occupation: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
     age: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FamilyMember = mongoose.model("FamilyMember", FamilyMemberSchema);
module.exports = FamilyMember;
