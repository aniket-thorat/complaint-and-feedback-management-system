const router = require("express").Router();
const {
  createCategory,
  getAllCategories,
  deleteCategory,
  getCategory,
  updateCategory
} = require("../controllers/categoryController");
const authenticateUser = require("../middleware/authenticateUser");

router.post("/", authenticateUser, createCategory);
router.get("/", getAllCategories);
router.get("/:categoryId", getCategory);
router.put("/:categoryId", updateCategory);
router.delete("/:categoryId", authenticateUser, deleteCategory);

module.exports = router;
