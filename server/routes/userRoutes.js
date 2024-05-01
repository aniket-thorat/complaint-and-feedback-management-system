const router = require("express").Router();
const {
  getUsersPerMonth,
  getAllUsers,
  getAdminUsers,
  updateUser,
  getUser
} = require("../controllers/userController");

router.get("/users-per-month", getUsersPerMonth);
router.get("/all-users", getAllUsers);
router.get("/all-admins", getAdminUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);

module.exports = router;
