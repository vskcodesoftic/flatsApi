const mongoose = require("mongoose");

const BlockSchema = mongoose.Schema(
  {
    Blocktitle: {
      type: String,
      required: true,
    },
    Blockdescription: {
      type: String,
      required: true,
    },
    BlockNumber: {
      type: Number,
    },
    TotalFlats: {
      type: Number,
      required: true,
    },
    flats: [{ type: mongoose.Types.ObjectId, ref: "Flats" }],
  },
  {
    timestamps: true,
  }
);

const Block = mongoose.model("Block", BlockSchema);
module.exports = Block;
