const express = require("express");
const jwt = require("jsonwebtoken");

const authController = require("../controllers/auth");

const router = express.Router();

router.post("/google-login", authController.handleLogin);
router.get("/verify", authController.verifyToken);

module.exports = router;
