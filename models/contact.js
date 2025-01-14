const {Schema, model} = require("mongoose");
const Joi = require("joi");
const {handleMongooseError} =require ('../helpers')

const contactSchema = new Schema({
  owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
}, {versionKey:false, timestamps: true});

contactSchema.post("save", handleMongooseError);
const Contact = model("contact", contactSchema);

// -----------------JOI SCHEMA-------------------------//

const validateContact = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean()
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemas = {
  validateContact,
  updateFavoriteSchema,
};

module.exports = {
  schemas,
  Contact,
};
