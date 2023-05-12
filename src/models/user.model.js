const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const UserSchema = new mongoose.Schema({     //this can be done or we can define once above and then use it later on
const UserSchema = Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  phoneNo: {
    type: Number,
    unique: true,
    required: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("users", UserSchema);

module.exports = User;
