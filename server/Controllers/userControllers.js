const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const generateToken = require("../config/generateToken");
const bcrypt = require('bcrypt');

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    res.status(400).json({ message: 'User already exists' });
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({ message: 'User created successfully' });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
      isBanned: user.isBanned,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    res.status(401).json({ message: 'Invalid Email or Password' });
    throw new Error("Invalid Email or Password");
  }
});

// Controller to get user data by ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
      pic: user.pic,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
//@description     Change user password
//@route           PUT /api/user/changepassword
//@access          Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if the current password matches
  if (!(await user.matchPassword(currentPassword))) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  // If the current password is correct, update the password
  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password changed successfully' });
});


//@description     Logout user
//@route           POST /api/user/logout
//@access          Private
const logoutUser = asyncHandler(async (req, res) => {
  // Perform any necessary actions for logout
  res.json({ message: 'Logged out successfully' });
});

//@description     Delete user account
//@route           DELETE /api/user/delete
//@access          Private
const deleteUserAccount = asyncHandler(async (req, res) => {
  const { currentPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Verify if the current password matches
  const isPasswordCorrect = await user.matchPassword(currentPassword);
  if (!isPasswordCorrect) {
    res.status(401);
    throw new Error('Invalid current password');
  }

  // Perform any necessary actions for account deletion
  await user.remove();

  res.json({ message: 'Account deleted successfully' });
});


//@description     Edit user
//@route           POST /api/user/edit
//@access          Private
//@description     Edit user
//@route           PUT /api/user/edit/:id
//@access          Private
const editUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.hasOwnProperty('isAdmin') ? req.body.isAdmin : user.isAdmin;
    user.isVerified = req.body.hasOwnProperty('isVerified') ? req.body.isVerified : user.isVerified;
    user.isBanned = req.body.hasOwnProperty('isBanned') ? req.body.isBanned : user.isBanned;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isVerified: updatedUser.isVerified,
      isBanned: updatedUser.isBanned,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});





module.exports = { allUsers, registerUser, authUser, getUserById, changePassword, logoutUser, deleteUserAccount, editUser };

