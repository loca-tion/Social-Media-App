const User = require("../models/user");

exports.getUser = async (req, res, next) => {
	try {
		const id = req.params.id;

		const user = await User.findById(id);
		res.status(200).json({
			user: user,
		});
	} catch (err) {
		res.status(500).json({
			err: err,
		});
	}
};
