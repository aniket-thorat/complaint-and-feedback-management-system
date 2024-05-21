const Category = require("../models/Category");
const Complaint = require("../models/Complaint");
const { checkPermissions } = require("../utils");

const createCategory = async (req, res) => {
	try {
		//checkPermissions(req.user, req.user._id);
		const { name } = req.body;

		const category = new Category({
			name,
		});

		const savedCategory = await category.save();
		res.json(savedCategory);
	} catch (error) {
		res.status(401).json({ error: error.message });
	}
};

const getAllCategories = async (req, res) => {
	try {
		const categories = await Category.find();
		console.log(categories);

		const response = await Promise.all(
			categories.map(async (category) => {
				const numberOfComplaints = await Complaint.countDocuments({
					category: category._id,
				});

				return {
					_id: category._id,
					name: category.name,
					number: numberOfComplaints,
				};
			})
		);

		res.status(200).json(response);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Unable to fetch categories" });
	}
};

const getCategory = async (req, res) => {
	const { categoryId } = req.params;
	try {
		const category = await Category.findById(categoryId);
		res.json(category);
	} catch (error) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
}

const updateCategory = async (req, res) => {
	const { categoryId } = req.params;
	const { name } = req.body;
	// console.log("The name of the category is: ", name);
	try {
		const updatedCategory = await Category.findByIdAndUpdate(categoryId, { name }, { new: true });
		if (!updatedCategory) {
			return res.status(404).json({ msg: 'Category not found' });
		}

		res.json(updatedCategory);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
}

const deleteCategory = async (req, res) => {
	try {
		checkPermissions(req.user, req.user._id);

		const deletedCategory = await Category.findByIdAndRemove(
			req.params.categoryId
		);

		if (!deletedCategory) {
			return res.status(404).json({ error: "Category not found" });
		}

		res.json({ message: "Category deleted successfully" });
	} catch (error) {
		res.status(401).json({ error: error.message });
	}
};

module.exports = {
	createCategory,
	getAllCategories,
	deleteCategory,
	getCategory,
	updateCategory
};
