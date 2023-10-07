const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		userName: {
			type: String,
			required: true,
		},
		userImage: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		body: { type: String },
		image: {
			type: String,
		},
		upVote: [
			{
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: "User",
			},
		],
		downVote: [
			{
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: "User",
			},
		],
		comments: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					ref: "User",
				},
				body: {
					type: String,
					required: true,
				},
				userName: {
					type: String,
					required: true,
				},
				imageUrl: {
					type: String,
					required: true,
				},
			},
		],
		numComments: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Post", postSchema);
