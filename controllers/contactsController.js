import Contact from "../models/contact.js";
import { contactValidation } from "../validations/validation.js";
import { httpError } from "../helpers/httpErrors.js";

const getContacts = async (_req, res) => {
  const result = await Contact.find({});
  res.json(result);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);

  if (!result) {
    throw httpError(404, "Not found");
  }

  res.json(result);
};

const addContact = async (req, res) => {
  const { error } = contactValidation.validate(req.body);
  if (error) {
    throw httpError(400, "missing required name field");
  }

  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

const deleteContact = async (req, res,) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);

  if (!result) {
    throw httpError(404, "Not found");
  }

  res.json({
    message: "Contact deleted",
  });
};

const updateContact = async (req, res) => {
  const { error } = contactValidation.validate(req.body);
  if (error) {
    throw httpError(400, "missing fields");
  }

  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

  if (!result) {
    throw httpError(404, "Not found");
  }

  res.json(result);
};

const updateFavoriteStatus = async (req, res) => {
  try {
    const { contactId } = req.params;
    console.log('Updating favorite status for contact with ID:', contactId);
    // http://localhost:3000/api/contacts/"id"/favorite
    // Update favorite status in the database
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });

    console.log('Result:', result); // Log the result from the database
    
    // Handle case where contact is not found
    if (!result) {
      console.log('Contact not found');
      throw httpError(404);
    }

    res.json(result);
  } catch (error) {
    console.error('Error in updateFavoriteStatus:', error);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export {
  getContacts,
  getContactById,
  addContact,
  deleteContact,
  updateContact,
  updateFavoriteStatus,
};
