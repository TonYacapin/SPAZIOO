const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  getUserById,
  changePassword,
  logoutUser,
  deleteUserAccount,
} = require("../Controllers/userControllers");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Route to get all users
router.route("/").get(protect, allUsers);
// Route to register a new user
router.route("/").post(registerUser);
// Route to authenticate user
router.post("/login", authUser);
// Route to get user by ID
router.route("/:id").get(protect, getUserById); // Define the route with a parameter
// Route to change user password
router.put("/changepassword", protect, changePassword);
// Route to logout user
router.post("/logout", protect, logoutUser);
// Route to delete user account
router.delete("/delete", protect, deleteUserAccount);

module.exports = router;
