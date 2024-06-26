import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
// prettier-ignore
import { signupUser, loginUser, logoutUser, getCurrentUsers, updateUserSubscription, updateAvatar, verifyEmail, resendVerifyEmail} from "../../controllers/usersController.js";
import { authenticateToken } from "../../middlewares/authenticateToken.js";
import { upload } from "../../middlewares/upload.js";

const router = express.Router();

/* POST: // http://localhost:3000/api/users/signup
{
  "email": "example@example.com",
  "password": "examplepassword"
}
*/
router.post("/signup", ctrlWrapper(signupUser));

/* POST: // http://localhost:3000/api/users/login
{
  "email": "example@example.com",
  "password": "examplepassword"
}
*/
router.post("/login", ctrlWrapper(loginUser));

/* GET: // http://localhost:3000/api/users/logout */
router.get("/logout", authenticateToken, ctrlWrapper(logoutUser));

/* GET: // http://localhost:3000/api/users/current */
router.get("/current", authenticateToken, ctrlWrapper(getCurrentUsers));

/* PATCH: // http://localhost:3000/api/users/
{
    "subscription":"pro"
}
*/
router.patch("/", authenticateToken, ctrlWrapper(updateUserSubscription));

/* PATCH: // http://localhost:3000/api/users/avatars
    form-data
    avatar,file : image
*/
// prettier-ignore
router.patch("/avatars", authenticateToken, upload.single("avatar"), ctrlWrapper(updateAvatar));

/* GET: // http://localhost:3000/api/users/verify/:verificationToken */
router.get("/verify/:verificationToken", ctrlWrapper(verifyEmail));

/* POST: // http://localhost:3000/api/users/verify 
{
  "email": "example@example.com",
}
*/
router.post("/verify", authenticateToken, ctrlWrapper(resendVerifyEmail));

export { router };
