const User = require("./../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

// @desc create new user
// @route POST /users
// access Public
const createNewUser = asyncHandler(async (req, res) => {
  const { fname, lname, email, username, password } = req.body;
  // Confirm Data
  if (!fname || !lname || !email || !username || !password) {
    return res.status(400).json({ message: "All Fields are required" });
  }

  // Check if username already exists

  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username found" });
  }

  const hashPass = await bcrypt.hash(password, 10); // Salt rounds

  const userObject = {
    fname,
    lname,
    email,
    username,
    password: hashPass,
  };

  // Create and Store the User

  const user = await User.create(userObject);

  if (user) {
    //Created
    res.status(201).json({ message: `User ${fname} created successfully` });
  } else {
    res.status(400).json({ message: "Invalid User Data" });
  }
});

// @desc Update user
// @route PATCH /users
// access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, fname, lname, email, username, password, isAdmin, active } =
    req.body;

  // Confirm Data

  if (
    !id ||
    !fname ||
    !lname ||
    !email ||
    !username ||
    typeof isAdmin !== "boolean" ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All Fields are Required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check for duplicate

  const duplicate_u = await User.findOne({ username }).lean().exec();
  const duplicate_e = await User.findOne({ email }).lean().exec();
  //Allow update to original user
  if ((duplicate_u && duplicate_u?._id.toString() !== id) || duplicate_e) {
    return res.status(409).json({ message: "Duplicate username or email" });
  }

  user.username = username;
  user.fname = fname;
  user.lname = lname;
  user.isAdmin = isAdmin;
  user.active = active;

  if (password) {
    // hash password
    user.password = await bcrypt.hash(password, 10); // Salt rounds
  }
  if (email) {
    user.email = email;
  }

  const updateUser = await user.save();

  res.json({ message: `User ${fname} updated` });
});

// @desc Delete user
// @route DELETE /users
// access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
});

// @desc Get Single Product
// @route GET /product/:id
// @access Public
const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID required" });
  }

  const user = await User.findById(id).lean();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  res.json(user);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getSingleUser,
};
