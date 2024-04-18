const router = require("express").Router();
const multer = require('multer');
const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  getComplaintsPerMonth,
  closeComplaint,
  // uploadImage,
} = require("../controllers/complaintController");
const authenticateUser = require("../middleware/authenticateUser");

router.post("/", authenticateUser, createComplaint);

router.get("/", authenticateUser, getAllComplaints);

router.get("/complaints-per-month", authenticateUser, getComplaintsPerMonth);

router.put("/close/:complaintId", authenticateUser, closeComplaint);

router.get("/:id", authenticateUser, getComplaintById);
// const upload = multer({ dest: 'uploads/' });
// router.post("/upload-image" , upload.single('image'), uploadImage);

module.exports = router;
