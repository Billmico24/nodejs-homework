import express from 'express';
import { listContacts, getContactById, removeContact, addContact, updateContact } from '../../models/contacts.js';
import { contactValidation } from '../../validations/validation.js';
import { httpError } from '../../helpers/httpErrors.js';

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const result = await listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await getContactById(contactId);

    if (!result) {
      throw httpError(404);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactValidation.validate(req.body);
    if (error) {
      throw httpError(400, error.details[0].message);
    }

    const result = await addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await removeContact(contactId);

    if (!result) {
      throw httpError(404);
    }

    res.json({
      message: "Contact deleted",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = contactValidation.validate(req.body);
    if (error) {
      throw httpError(400, error.details[0].message);
    }

    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body);

    if (!result) {
      throw httpError(404);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export { router };
