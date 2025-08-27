const validate = require("./validation");
const Joi = require("joi");

module.exports = {
  
  // ----------------- User Schema ----------------------------------------------

  userSchema: Joi.object().keys({
    email: validate.reqEmail,
    password: validate.string,
    user_name: validate.reqString,
    role: validate.reqString,
  }),

  signInUserSchemas: Joi.object()
    .keys({
      email: validate.string,
      password: validate.reqString,
    })
    .or("email", "id"),

  // ----------------- Task Schema ----------------------------------------------

  taskSchema: Joi.object().keys({
    title: validate.reqString,
    status: validate.reqString,
    publishedDate: validate.reqDate,
    content: validate.reqString,
    image: validate.reqString,
  }),
};
