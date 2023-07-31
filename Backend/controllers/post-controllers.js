import Post from "../model/Post.js";

export const createPost = async (req, res, next) => {
  const post = new Post(req.body);
  try {
    const savePost = await post.save();
    res.status(200).json(savePost);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const apost = await Post.findById(req.params.id);
    if (apost.userId === req.body.userId) {
      await apost.updateOne({ $set: req.body });
      res.status(200).json("Your Post has been succesfully updated !");
    } else {
      return res.status(403).json("You can only update you post only ");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const apost = await Post.findById(req.params.id);
    if (apost.userId === req.body.userId) {
      await apost.deleteOne();
      res.status(200).json("Your Post has been deleted succesfully !");
    } else {
      return res.status(403).json("You can only delete your post only ");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const likes = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("Y like this post");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("u dislike this post");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
