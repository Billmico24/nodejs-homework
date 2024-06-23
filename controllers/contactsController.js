import { Contact } from "../models/contactsModel.js";
import { contactValidation, favoriteValidation } from "../validations/validation.js";
import { httpError } from "../helpers/httpError.js";

// Get all contacts, with optional pagination and filtering by favorite
const getAllContacts = async (req, res) => {
  const { page = 1, limit = 20, favorite } = req.query;
  const query = favorite ? { favorite: true } : {};

  const result = await Contact.find(query)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json(result);
};

// Get a contact by ID
const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);

  if (!result) {
    throw httpError(404, "Contact ID Not Found");
  }

  res.json(result);
};

// Add a new contact
const addContact = async (req, res) => {
  const { error } = contactValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }

  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

// Delete a contact by ID
const deleteContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);

  if (!result) {
    throw httpError(404, "Contact ID Not Found");
  }

  res.json({ message: "Contact deleted" });
};

// Update a contact by ID
const updateContactById = async (req, res) => {
  const { error } = contactValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }

  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

  if (!result) {
    throw httpError(404, "Contact ID Not Found");
  }

  res.json(result);
};

// Update the favorite status of a contact by ID
const updateStatusContact = async (req, res) => {
  const { error } = favoriteValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }

  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

  if (!result) {
    throw httpError(404, "Contact ID Not Found");
  }

  res.json(result);
};

export {
  getAllContacts,
  getContactById,
  addContact,
  deleteContactById,
  updateContactById,
  updateStatusContact
};

