const Category = require("../models/Category");
const Complaint = require("../models/Complaint");
const Message = require("../models/Message");
const Image = require('../models/Image')
const moment = require("moment");
const multer = require('multer');

// Configure multer for handling multipart/form-data (file uploads)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
// const upload = multer({ storage: storage });

// const uploadImage = async (req, res) => {
//   try {
//     // Create a new Image document
//     const newImage = new Image({
//         complaintId: req.body.text,
//         image: req.file // Assuming 'path' is where Multer saves the image
//     });
//     // Save the image to MongoDB
//     await newImage.save();
//     res.status(201).send('Image uploaded successfully!');
// } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal Server Error');
// }
// }

const createComplaint = async (req, res) => {
  try {
    const { title, category, text , product_rating} = req.body;
    console.log(req.body)
    const user = req.user._id;
console.log("Rating received is ", product_rating)
    const categoryDoc = await Category.findOne({ _id: category });

    if (!categoryDoc) {
      return res.status(400).json({ error: "Category not found" });
    }

    const complaint = new Complaint({
      title,
      category: categoryDoc._id,
      user,
      product_rating,
      // image,
    });

    const savedComplaint = await complaint.save();

    const lastInsertedComplaintId = savedComplaint._id;
    const from = req.user.role === "admin" ? "1" : "0";

    const message = new Message({
      complaintId: lastInsertedComplaintId,
      from,
      text,
      // rating
    });

    const savedMessage = await message.save();
    res.json({ complaint: savedComplaint, message: savedMessage });
  } catch (error) {
    res.status(400).json({ error: "Unable to create a complaint and message" });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    const filter = userRole === "admin" ? {} : { user: userId };
    const projection = {
      _id: 1,
      title: 1,
      status: 1,
      date_created: 1,
      date_closed: 1,
      user: 1,
    };

    const complaints = await Complaint.find(filter, projection)
      .populate("category", "name")
      .populate("user", "firstName lastName")
      .sort({ date_created: -1 });
    const modifiedComplaints = complaints.map((complaint) => ({
      _id: complaint._id,
      title: complaint.title,
      category: complaint.category.name,
      status: complaint.status,
      date_created: complaint.date_created,
      date_closed: complaint.date_closed,
      user: complaint.user.firstName + " " + complaint.user.lastName,
    }));

    res.status(200).json(modifiedComplaints);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch complaints" });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const userId = req.user._id;
    const userRole = req.user.role;

    let complaint;

    if (userRole === "admin") {
      complaint = await Complaint.findById(complaintId)
        .populate({
          path: "category",
          select: "name",
        })
        .populate("user", "_id firstName lastName email phone");
    } else {
      complaint = await Complaint.findOne({
        _id: complaintId,
        user: userId,
      }).populate({
        path: "category",
        select: "name",
      });
    }

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (
      complaint.user.toString() !== userId.toString() &&
      userRole !== "admin"
    ) {
      return res.status(401).json({
        message: "You do not have permission to access this complaint",
      });
    }

    const categoryName = complaint.category.name;

    const modifiedComplaint = {
      title: complaint.title,
      category: categoryName,
      status: complaint.status,
      date_created: complaint.date_created,
      date_closed: complaint.date_closed,
      userId: complaint.user._id,
      userName: complaint.user.firstName + " " + complaint.user.lastName,
      userEmail: complaint.user.email,
      userPhone: complaint.user.phone,
    };

    res.status(200).json(modifiedComplaint);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch the complaint" });
  }
};

const getComplaintsPerMonth = async (req, res) => {
  try {
    let complaintsPerMonth = await Complaint.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date_created" },
            month: { $month: "$date_created" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
    ]);

    complaintsPerMonth = complaintsPerMonth
      .map((item) => {
        const {
          _id: { year, month },
          count,
        } = item;
        const date = moment()
          .month(month - 1)
          .year(year)
          .format("MMM Y");
        return { date, count };
      })
      .reverse();

    res.status(200).json(complaintsPerMonth);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch complaints per month" });
  }
};

// Function to fetch date_created and rating from Complaints collection
const getDateAndRating = async(req, res) => {
  try {
    // Fetch documents with date_created and rating fields
    const projection = {
      _id: 0,
      date_created: 1,
      product_rating: 1,
    };
    const complaints = await Complaint.find({}, projection).lean();
    console.log(complaints)

    // Format the data as a list of dictionaries
    const data = complaints.map(({ date_created, product_rating }) => ({ date_created, product_rating }));
    // console.log(data);
    // return data;
    res.status(201).json(data)
  } catch (error) {
    console.error('Error fetching data:', error);
    // return [];
    res.status(500).json({error: "Error fetching data"})
  }
}

const closeComplaint = async (req, res) => {
  const { complaintId } = req.params;

  try {
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to close this complaint",
      });
    }

    if (complaint.status === 0) {
      return res.status(400).json({ message: "Complaint is already closed" });
    }

    complaint.date_closed = new Date();
    complaint.status = 0;

    await complaint.save();

    res.status(200).json({ message: "Complaint closed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unable to close the complaint" });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  getComplaintsPerMonth,
  closeComplaint,
  // uploadImage,
};
