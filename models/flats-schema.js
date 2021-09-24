const mongoose = require("mongoose");

const FlatsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    flatno: {
      type: Number,
      required: true,
    },
    BlockNumber: {
      type: Number,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    ownerContactNumber: {
      type: Number,
      required: true,
    },
    ownerEmail: {
      type: String,
    },
    ownerOccupation: {
      type: String,
    },
    NumberOfFamilyMembers: {
      type: Number,
      required: true,
    },
    famliyMembersList: [
      {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    ],

    famliyMembers: [{ type: mongoose.Types.ObjectId, ref: "FamilyMember" }],
  },
  {
    timestamps: true,
  }
);

const Flats = mongoose.model("Flats", FlatsSchema);
module.exports = Flats;
