const {Contact} = require("../models/contact")

const { HttpError, ctrlWrapper } = require("../helpers");


const getAll =  async(req, res, next) => {
    const {_id: owner} = req.user;
    const {page = 1, limit = 10,...query} = (req.query)
    const skip = (page - 1)*limit;
    const result = await Contact.find({ owner, ...query}, "-createdAt -updatedAt", {skip, limit}).populate("owner", "name email");
    const total = await Contact.where({ owner, ...query }).countDocuments();
    res.status(200).json(result);
}


const getById = async (req, res, next) => {
    const {contactId} = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
};


const add = async (req, res, next) => {
    const { _id: owner } = req.user;
    const result = await Contact.create({...req.body, owner});
    if (!result) {
      return res.status(400).json({ message: "alredy in contact" });
    }
    res.status(201).json(result);
};


const dellete = async (req, res, next) => {
   const result = await Contact.findByIdAndDelete(req.params.contactId);
    if (!result) {
      throw HttpError(400, "Not found");
    }
    res.status(200).json({ message: "contact deleted" })
}


const updateById = async (req, res, next) => {
    
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body,{new: true});
    if (!result) {
      throw HttpError(400, "Not found");
    }
    res.status(200).json(result);
};

const updateStatusContact = async(req, res,next) => {

  if (!Object.hasOwn(req.body, "favorite")) {
    return res.status(400).json({ message: "missing field favorite" });
  }
      const {contactId} = req.params;
      const result = await Contact.findByIdAndUpdate(contactId, req.body,{new: true});

      if (!result) {
        throw HttpError(400, "Not found");
      }
      res.status(200).json(result);
  }

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  dellete: ctrlWrapper(dellete),
  updateById: ctrlWrapper(updateById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
