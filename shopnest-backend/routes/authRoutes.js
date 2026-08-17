const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile, promoteToAdmin } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

if (process.env.NODE_ENV !== "production") {
  router.post("/dev/promote", protect, promoteToAdmin);
}

module.exports = router;