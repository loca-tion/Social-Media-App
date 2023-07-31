import express from "express";
import { createPost, deletePost, updatePost } from "../controllers/post-controllers.js";

const router = express.Router();

router.post("/",createPost);
router.put("/:id",updatePost);
router.delete("/:id",deletePost);

export default router;