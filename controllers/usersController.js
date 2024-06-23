import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../models/usersModel.js";
import { userValidation, subscriptionValidation } from "../validations/validation.js";
import { httpError } from "../helpers/httpError.js";

const { SECRET_KEY } = process.env;

const signupUser = async (req, res) => {
  const { email, password } = req.body;
  const { error } = userValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }
  const user = await User.findOne({ email });
  if (user) {
    throw httpError(409, "Email in Use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, password: hashPassword });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
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

export {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUsers,
  updateUserSubscription,
};
