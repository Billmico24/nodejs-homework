import bcrypt from "bcryptjs";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import "dotenv/config";
import Jimp from "jimp";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import fs from "fs/promises";
import { User } from "../models/usersModel.js";
import { userValidation, subscriptionValidation } from "../validations/validation.js";
import { httpError } from "../helpers/httpError.js";

const { SECRET_KEY } = process.env;

const signupUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate user input
  const { error } = userValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }

  // Check if the email is already in use
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw httpError(409, "Email already in use");
  }

  // Hash the password
  const hashPassword = await bcrypt.hash(password, 10);

  // Create a link to the user's avatar with gravatar
  const avatarURL = gravatar.url(email, { protocol: "http" });

  // Create the user
  const newUser = await User.create({ email, password: hashPassword, avatarURL });

  // Send the response
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription, // Assuming `subscription` is a field in the User model
      avatarURL: newUser.avatarURL, // Assuming `avatarURL` is a field in the User model
    },
  });
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const { error } = userValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw httpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logoutUser = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json();
};

const getCurrentUsers = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const updateUserSubscription = async (req, res) => {
  const { error } = subscriptionValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }
  const { _id } = req.user;

  const { subscription } = req.body;
  
  const result = await User.findByIdAndUpdate(_id, { subscription }, { new: true });
  if (!result) {
    throw httpError(404, "User not found");
  }
  res.json({
    email: result.email,
    subscription: result.subscription,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, originalname } = req.file;

  await Jimp.read(oldPath).then((image) =>
    // image.resize(250, 250).write(oldPath)
    image.cover(250, 250).write(oldPath)
  );

  const extension = path.extname(originalname);

  // const filename = `${_id}${extension}`;
  const filename = `${uuidv4()}${extension}`;


  const newPath = path.join("public", "avatars", filename);
  await fs.rename(oldPath, newPath);

  let avatarURL = path.join("/avatars", filename);

  // for windows
  avatarURL = avatarURL.replace(/\\/g, "/");

  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({ avatarURL });
};

export {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUsers,
  updateUserSubscription,
  updateAvatar,
};
