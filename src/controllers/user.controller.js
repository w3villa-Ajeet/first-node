const UserService = require("../services/user.service");
const {
  userCreationValidator,
  loginValidator,
} = require("../validators/user.validator");
const { isValidId } = require("../validators/idValidator");
const secreteKey = process.env.JWT_SECRETKEY;
const jwt = require("jsonwebtoken");
const { AppError, handleError } = require("../helper/error");

exports.save = async (req, res) => {
  try {
    const { error, value } = userCreationValidator.validate(req.body);

    if (error) {
      // return res.status(403).send(error.details[0].message); //403- forbidden
      const errorMessage = error.details.map((el) => el.message);
      let err = {
        message: errorMessage[0]
      }
      handleError(err, req, res)
      // throw new AppError(400, errorMessage);
    }

    // await UserService.create(req, res);
  } catch (error) {
    console.log("error:", error);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    await UserService.getAll(req, res);
  } catch (error) {
    console.log("error:", error);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
console.log("check error", jwt.verify(req.params.token, secreteKey));

    const {
      data: { email },
    } = jwt.verify(req.params.token, secreteKey);
    const verified = await UserService.verifyemail(email);
    if (verified) {
      return res.send("Email verified successfully!");
    } else {
      return res.status(500).json({
        success: false,
        message: "Something went worng, please try again!",
      });
    }
  } catch (error) {
    console.log("error", error);
  }
};

exports.getOne = async (req, res) => {
  try {
    await UserService.getOne(req, res);
  } catch (error) {
    console.log("error:", error);
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    await UserService.updateUserProfile(req, res);
  } catch (error) {
    console.log("error:", error);
  }
};

exports.deleteOne = async (req, res) => {
  try {
    console.log("check id", req.params.id);
    // if (req.params._id === undefined) {
    //   return res.status(403).send("Id is required");
    // }
    if (!isValidId(req.params.id)) {
      return res.status(403).send("Id is not valid");
    } else {
      //   console.log("else delete");
      await UserService.deleteOne(req, res);
    }
  } catch (error) {
    console.log("error:", error);
  }
};

exports.setActiveInactiveUser = async (req, res) => {
  try {
    await UserService.setActiveInactiveUser(req, res);
  } catch (error) {
    console.log("error:", error);
  }
};

exports.login = async (req, res) => {
  try {
    const { error } = loginValidator.validate(req.body);

    if (error) {
      return res.status(403).send(error.details[0].message);
    }

    await UserService.login(req, res);
  } catch (error) {
    console.log("error:", error);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    await UserService.resetPassword(req, res);
  } catch (error) {
    console.log("error:", error);
  }
};

exports.signInMobile = async (req, res) => {
  try {
    await UserService.signInWithMobile(req, res);
  } catch (error) {
    console.log("error", error);
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    await UserService.verifyOTP(req, res);
  } catch (error) {
    console.log("error", error);
  }
};
