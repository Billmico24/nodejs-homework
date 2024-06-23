import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
import {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUsers,
  updateUserSubscription,
  updateAvatar,
} from "../../controllers/usersController.js";
import { authenticateToken } from "../../middlewares/authenticateToken.js";
import { upload } from "../../middlewares/upload.js";

const router = express.Router();

router.post("/signup", ctrlWrapper(signupUser));

router.post("/login", ctrlWrapper(loginUser));

router.get("/logout", authenticateToken, ctrlWrapper(logoutUser));

router.get("/current", authenticateToken, ctrlWrapper(getCurrentUsers));

router.patch("/", authenticateToken, ctrlWrapper(updateUserSubscription));

/* PATCH: // http://localhost:3000/api/users/avatars
    form-data
    avatar,file : image
*/
router.patch("/avatars", authenticateToken, upload.single("avatar"), ctrlWrapper(updateAvatar));

export { router };
