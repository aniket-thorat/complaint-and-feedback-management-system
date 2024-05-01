const User = require("../models/User");
const moment = require("moment");
const { body, validationResult } = require('express-validator');

const getUsersPerMonth = async (req, res) => {
	try {
		let usersPerMonth = await User.aggregate([
			{
				$group: {
					_id: {
						year: { $year: "$createdAt" },
						month: { $month: "$createdAt" },
					},
					count: { $sum: 1 },
				},
			},
			{ $sort: { "_id.year": -1, "_id.month": -1 } },
			{ $limit: 6 },
		]);

		usersPerMonth = usersPerMonth
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

		res.status(200).json(usersPerMonth);
	} catch (error) {
		res.status(500).json({ error: "Unable to fetch users per month" });
	}
};

const getAllUsers = async (req, res) => {
	try {
		const users = await User.find().select("-password -role -updatedAt");

		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ error: "Unable to fetch users" });
	}
};

const getAdminUsers = async (req, res) => {
	try {
		const adminUsers = await User.find({ role: "admin" }).select(
			"-password -role -updatedAt"
		);

		res.status(200).json(adminUsers);
	} catch (error) {
		res.status(500).json({ error: "Unable to fetch admin users" });
	}
};

const getUser = async (req, res) => {
	const { id } = req.params;
	console.log("The user id is: ", id);
	try {
		const user = await User.findById(id);
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
}

const updateUser = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { id } = req.params;
	const { email, firstName, lastName, phone } = req.body;

	try {
		// Find the user by ID and update the details
		const updatedUser = await User.findByIdAndUpdate(id, { email, firstName, lastName, phone }, { new: true });

		if (!updatedUser) {
			return res.status(404).json({ msg: 'User not found' });
		}

		res.json(updatedUser);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
}

module.exports = {
	getUsersPerMonth,
	getAllUsers,
	getAdminUsers,
	updateUser,
	getUser
};
