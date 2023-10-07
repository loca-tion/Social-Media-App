const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const client = new OAuth2Client(process.env.CLIENT_ID);

exports.handleLogin = async (req, res, next) => {
	// POST
	const { token } = req.body;
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: process.env.CLIENT_ID,
	});

	// ticket.payload contains information about the user
	const { name, email, picture, sub } = ticket.getPayload();
	// sub -> Unique Identifier for this user.

	let user = await User.findOne({ email: email });
	if (!user) {
		const addedUser = new User({
			name: name,
			email: email,
			imageUrl: picture,
			sub: sub,
		});
		user = await addedUser.save();
	}

	const jwtToken = jwt.sign(
		{
			name,
			email,
			picture,
			sub,
			_id: user._id,
		},
		process.env.secret_key,
		{
			expiresIn: "1h",
		}
	);

	res.status(200).json({
		message: "User LoggedIn Successfully!",
		token: jwtToken,
		userData: {
			_id: user._id,
			name: user.name,
			email: user.email,
			imageUrl: user.imageUrl,
			sub: user.sub,
		},
	});
};

exports.verifyToken = async (req, res, next) => {
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
		return res.status(401).json({
			message: "Not Authenticated",
		});
	}
	if (!decodedToken) {
		res.status(401).json({
			message: "Not a valid token",
		});
	} else {
		res.status(200).json({
			message: "Valid User",
			userData: {
				name: decodedToken.name,
				email: decodedToken.email,
				imageUrl: decodedToken.picture,
				sub: decodedToken.sub,
				_id: decodedToken._id,
			},
		});
	}
};
