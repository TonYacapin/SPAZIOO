const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../Controllers/userControllers");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);

module.exports = router;