const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint",
    required: true,
  },
  image: {
    type : Buffer,
  },
});

module.exports = mongoose.model("Image", imageSchema);
