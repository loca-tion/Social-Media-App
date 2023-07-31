import User from "../model/user.js";
import bcrypt from "bcryptjs";

export const getAllUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (error) {
    console.log(error);
  }

  if (!users) {
    return res.status(404).json({ message: "No User Found" });
  }

  return res.status(200).json({ users });
};

export const signup = async (req, res, next) => {
  const { name, email, password, profilePic } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return console.log(error);
  }

  const hashedPassword = bcrypt.hashSync(password);
  if (!existingUser) {
    const user = new User({
      name,
      email,
      password: hashedPassword,
      profilePic,
    });

    try {
      await user.save();
    } catch (error) {
      console.log(error);
    }
    return res.status(201).json({ user });
  }

  res.status(400).json({ message: "User Already registered " });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return console.log(error);
  }

  if (!existingUser) {
    return res.status(404).json({ message: "User is not registered !" });
  }
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json({ message: "Either Password or Email is incorrect" });
  }

  return res.status(200).json({ message: "Login Succesfull !" });
};

export const updateUser = async (req, res, next) => {
  if (req.body.userId == req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        req.body.password = bcrypt.hashSync(req.body.password);
      } catch (error) {
        return res.status(500).json(error);
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated!");
    } catch (error) {}
  } else {
    return res.status(403).json("You can Only update value in own Account !");
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.body.userId == req.params.id || req.body.isAdmin) {
    try {
      const user = await User.deleteOne(req.params.id);
      res.status(200).json("Account has been delted!");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can Only delete your own Account !");
  }
};

export const getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json("No user found!");
  }
};

export const followUser = async (req, res, next) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const followuser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await followuser.updateOne({ $push: { following: req.params.id } });
        return res.status(200).json("User has been followed!");
      } else {
        return res.status(403).json("You Already follow this user !");
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("you can't follow yourself !");
  }
};

export const unfollowUser = async (req, res, next) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const unfollowuser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await unfollowuser.updateOne({ $pull: { following: req.params.id } });
        return res.status(200).json("User has been unfollowed!");
      } else {
        return res.status(403).json("You don't follow this user !");
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("you can't follow yourself !");
  }
};
