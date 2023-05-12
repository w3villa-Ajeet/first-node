const mongoose = require("mongoose");

const isValidId = (id) => {
  return mongoose.Types.ObjectId.isValid(id); //isValid function checks if id is ObjectId or not
};

module.exports = { isValidId };
