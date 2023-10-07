const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	const authHeader = req.get("Authorization");
	if (!authHeader) {
		return res.status(401).json({
			message: "Not Authenticated",
		});
	}

	const token = authHeader.split(" ")[1];
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, process.env.secret_key);
	} catch (err) {
		// console.log(err);
		return res.status(401).json({
			message: "Not Authenticated",
		});
	}
	// console.log(2);
	if (!decodedToken) {
		res.status(401).json({
			message: "Not a valid token",
		});
	} else {
		req.userId = decodedToken._id;
		next();
	}
};
