import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
import {
  addContact,
  deleteContactById,
  getAllContacts,
  getContactById,
  updateContactById,
  updateStatusContact,
} from "../../controllers/contactsController.js";
import { authenticateToken } from "../../middlewares/authenticateToken.js";

const router = express.Router();

router.get("/", ctrlWrapper(getAllContacts));

router.get("/:contactId", authenticateToken, ctrlWrapper(getContactById));

router.post("/", authenticateToken, ctrlWrapper(addContact));

router.delete("/:contactId", authenticateToken, ctrlWrapper(deleteContactById));

router.put("/:contactId", authenticateToken, ctrlWrapper(updateContactById));

router.patch("/:contactId/favorite", authenticateToken, ctrlWrapper(updateStatusContact));

export { router };
