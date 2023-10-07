const Post = require("../models/post");
const User = require("../models/user");

exports.getPosts = async (req, res, next) => {
	try {
		const userId = req.query.id;
		const query = {};
		let data;

		if (userId) {
			query.user = userId;
			data = await Post.find(query);
		} else {
			data = await Post.find();
		}
		res.status(200).json({
			posts: data,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			err: err,
		});
	}
};

exports.createPost = async (req, res, next) => {
	const data = req.body;

	const post = new Post(data);
	const savedPost = await post.save();
	const user = await User.findById(req.userId);
	user.posts.push(savedPost);
	await user.save();

	res.status(200).json({
		message: "Reached Successfully!",
		post: savedPost,
	});
};

exports.upvotePost = async (req, res, next) => {
	try {
		const postId = req.params.id;

		const userId = req.userId;

		const post = await Post.findOne({ _id: postId });
		// upVote

		const present = post.upVote.find(
			(element) => element.toString() === userId.toString()
		);

		if (!present) {
			post.upVote.push(userId);
		}

		post.downVote = post.downVote.filter(
			(element) => element.toString() !== userId
		);

		const newPost = await post.save();
		res.status(200).json({
			message: "Updated Successfully",
			upVote: newPost.upVote.length,
			downVote: newPost.downVote.length,
		});
	} catch (err) {
		res.status(500).json({
			err: err,
		});
	}
};

exports.downvotePost = async (req, res, next) => {
	try {
		const postId = req.params.id;

		const userId = req.userId;

		const post = await Post.findOne({ _id: postId });
		// upVote

		const present = post.downVote.find(
			(element) => element.toString() === userId.toString()
		);

		if (!present) {
			post.downVote.push(userId);
		}

		post.upVote = post.upVote.filter(
			(element) => element.toString() !== userId
		);

		const newPost = await post.save();
		res.status(200).json({
			message: "Updated Successfully",
			upVote: newPost.upVote.length,
			downVote: newPost.downVote.length,
		});
	} catch (err) {
		res.status(500).json({
			err: err,
		});
	}
};

exports.deletePost = async (req, res, next) => {
	try {
		const postId = req.params.id;

		const post = await Post.findOne({ _id: postId });
		if (post.user.toString() !== req.userId.toString()) {
			res.status(401).json({
				message: "Not a Authenticated User",
			});
		}

		const user = await User.findById(req.userId);
		user.posts = user.posts.filter(
			(element) => element.toString() !== postId.toString()
		);

		await user.save();
		const removedPost = await Post.findByIdAndDelete(postId);
		res.status(200).json({
			message: "Deleted Successfully",
			removedPost: removedPost,
		});
	} catch (err) {
		res.status(500).json({
			message: "Something Went Wrong",
		});
	}
};

exports.getPost = async (req, res, next) => {
	try {
		const postId = req.params.id;
		const post = await Post.findById(postId);
		res.status(200).json({
			post: post,
		});
	} catch (err) {
		res.status(500).json({
			err: err,
		});
	}
};

exports.createComment = async (req, res, next) => {
	try {
		const { comment } = req.body;
		const postId = req.params.id;

		const post = await Post.findById(postId);
		post.comments.push({
			...comment,
		});
		post.numComments++;
		const newPost = await post.save();
		res.status(200).json({
			comments: newPost.comments,
			numComments: newPost.numComments,
		});
	} catch (err) {
		res.status(500).json({
			err: err,
		});
	}
};
