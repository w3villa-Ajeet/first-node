const JoiBase = require("joi"); //used for validation [npm i joi]
const JoiDate = require("@hapi/joi-date"); //[npm i @hapi/joi-date]

const Joi = JoiBase.extend(JoiDate);

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userCreationValidator = Joi.object({
  email: Joi.string().regex(emailRegex).trim().required(),
  first_name: Joi.string().min(2).trim().required(),
  last_name: Joi.string().min(2).trim().required(),
  phoneNo: Joi.string().min(10).trim().required(),
  password: Joi.string().min(8).trim().required(),
});

const loginValidator = Joi.object({
  email: Joi.string().regex(emailRegex).trim(),
  phoneNo: Joi.string().min(10).trim(),
  password: Joi.string().min(8).trim().required(),
});

module.exports = { userCreationValidator, loginValidator };
