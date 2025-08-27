const Joi = require("joi");

module.exports = {
  string: Joi.string().min(0),
  reqString: Joi.string().required(),
  reqEmail: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  email: Joi.string().email({ tlds: { allow: false } }),
  reqArray: Joi.array().required(),
  reqBoolean: Joi.boolean().required(),
  reqDate: Joi.date().required(),
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
};
