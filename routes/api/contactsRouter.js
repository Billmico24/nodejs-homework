import express from "express";
import {
  getContacts,
  getContactById,
  addContact,
  deleteContact,
  updateContact,
  updateFavoriteStatus,
} from "../../controllers/contactsController.js";

const router = express.Router();

router.get("/", getContacts);

router.get("/:contactId", getContactById);

router.post("/", addContact);

router.delete("/:contactId", deleteContact);

router.put("/:contactId", updateContact);

router.patch("/:contactId/favorite", updateFavoriteStatus);

export { router };
