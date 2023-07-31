import express from "express";
import { deleteUser, followUser, getAllUser, getSingleUser, unfollowUser, updateUser } from "../controllers/user-controller.js";
import { signup } from "../controllers/user-controller.js";
import { login } from "../controllers/user-controller.js";

const router = express.Router();

router.get("/", getAllUser);
router.post("/signup", signup);
router.get("/login",login);
router.put("/:id",updateUser);
router.get("/:id", getSingleUser);
router.delete("/:id",deleteUser);
router.put("/:id/follow",followUser);
router.put("/:id/unfollow",unfollowUser);



export default router;
