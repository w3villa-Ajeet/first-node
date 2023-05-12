const express = require("express");
const UserController = require("../controllers/user.controller");
// const User = require("../models/user.model");
const { isValid } = require("../validators/validToken");

const router = express.Router();

// to create a user
router.post("/", UserController.save);

// to get all users
router.get("/all", [isValid, UserController.getAllUsers]); //we pass the isValid method that checks the token is valid or not

// to get a user
router.get("/:id", UserController.getOne);

// to delete a user
router.delete("/:id", UserController.deleteOne);

// to update whole user
router.put("/", UserController.updateUserProfile);

// to update a field in user
router.patch("/:id", UserController.setActiveInactiveUser);

// to login a user
router.post("/login", UserController.login);

// to forgetPassword a user
router.post("/resetPassword", UserController.resetPassword);

router.get("/verify-email/:token", UserController.verifyEmail);

router.post("/login/mobile", UserController.signInMobile);

router.post("/login/verify-otp", UserController.verifyOTP);

module.exports = router;
