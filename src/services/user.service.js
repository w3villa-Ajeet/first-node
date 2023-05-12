const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRETKEY;
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail"); //for email verification- npm i @sendgrid/mail
sgMail.setApiKey(process.env.TWILIO_EMAIL_KEY);
const secreteKey = process.env.JWT_SECRETKEY;
const twilio = require("twilio");

const SibApiV3Sdk = require("sib-api-v3-sdk");
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.TWILIO_EMAIL_KEY;

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.create = async (req, res) => {
  try {
    //DB queries to be written here.
    const {
      first_name,
      last_name,
      email,
      password,
      phoneNo: phoneNo,
    } = req.body;

    const full_name = `${first_name} ${last_name}`;

    const token = await jwt.sign({ data: { email: email } }, secreteKey, {
      expiresIn: "10h",
    });
    const url = `${process.env.HOST}:${process.env.PORT}/users/verify-email/${token}`;

    const hashedPass = await bcrypt.hash(password, 10); //used to encrypt password
    // console.log("hashed password", hashedPass)

    let userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(403).send("User already exists");
    }

    let user = await User.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      phoneNo: phoneNo,
      password: hashedPass,
    });

    console.log("check url>>>>", url);
    new SibApiV3Sdk.TransactionalEmailsApi()
      .sendTransacEmail({
        subject: "Team Dev Account Verification Link",
        sender: { email: "support@teamdev.com", name: "Team Dev" },
        to: [{ name: full_name, email: email }],
        htmlContent: `<html><body><h1><a id="button_validation" href=${url} target="_blank">Click here</a> to verify email.</h1></body></html>`,
        // params: { bodyMessage: "Made just for you!" },
      })
      .then(
        function (data) {
          console.log(data);
          return res.status(200).json({
            success: true,
            message: "Verification link sent to email, please verify!",
          });
        },
        function (error) {
          console.log(error);
          return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again!",
          });
        }
      );

    // const token = await jwt.sign({ data: { email: email } }, secretKey, {
    //   expiresIn: "10h",
    // });
    // const url = `${process.env.HOST}/users/verify-email/${token}`;
    // const msg = {
    //   to: email,
    //   from: {
    //     email: "noreply@techdev.com",
    //     name: "Team Dev",
    //   },
    //   // template_id: FORGOT_PASSWORD_MAIL_TEMPLATE,

    //   subject: "Team dev Account Verification Link",
    //   html: `<h3><a id="button_validation" href=${url} target="_blank">Click here</a> to verify email.</h3>`,
    // };
    // sgMail
    //   .send(msg)
    //   .then((success) => {
    //     if (success) {
    //       res.status(200).json({
    //         success: true,
    //         message: "Verification link sent to email, please verify!",
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     return res.status(500).json({
    //       success: false,
    //       message: "Something went wrong, please try again!",
    //     });
    //   });

    // res.status(201).json({
    //   success: true,
    //   message: "User created successfully!",
    // });
  } catch (error) {
    console.log("error:", error);
    res.status(500).send("Server Error!!");
  }
};

exports.verifyemail = async (email) => {
  try {
    const user = await User.findOne({ email: email });

    if (user) {
      await User.updateOne(
        { email: email },
        { $set: { isEmailVerified: true } }
      );
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("error", error);
  }
};

exports.getAll = async (req, res) => {
  try {
    let users = await User.find(); //this will return all the users list

    res.status(200).json({
      success: true,
      message: "Users found successfully!",
      data: users,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).send("Server Error!!");
  }
};

exports.getOne = async (req, res) => {
  try {
    let user = await User.findById(req.params.id); //this will return any particular user with specified id
    //   let users = await User.find(_id: req.params.id); //this will return all the possible users under a particular condition (where clause executes)
    //   let users = await User.findOne(_id: req.params.id); //this will return one particular user from all the possible users under a particular condition (where clause executes with top 1 type)

    res.status(200).json({
      success: true,
      message: "User found successfully!",
      data: user,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).send("Server Error!!");
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;

    await User.updateOne(
      { email: email }, //this becomes the where clause as to which record we want to update
      { $set: { first_name: first_name, last_name: last_name } } //the records that we want to update
    );

    let user = await User.find({ email: email });

    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      data: user,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).send("Server Error!!");
  }
};

exports.deleteOne = async (req, res) => {
  try {
    let user = await User.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "User deleted successfully!",
      data: user,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).send("Server Error!!");
  }
};

exports.setActiveInactiveUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    let isUserActive = user.isActive;

    await User.updateOne(
      { _id: req.params.id }, //this becomes the where clause as to which record we want to update
      { $set: { isActive: !isUserActive } } //the records that we want to update
    );
    let finalUser = await User.find({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      data: finalUser,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).send("Server Error!!");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, phoneNo, password } = req.body;

    let existingUser;
    if (!email) {
      existingUser = await User.findOne({ phoneNo: phoneNo });
    } else {
      existingUser = await User.findOne({ email: email });
    }

    if (!existingUser) {
      return res.status(403).send("User not found.");
    }

    bcrypt.compare(password, existingUser.password).then((isMatch) => {
      //compares the password after decrypting the save encrypted password from db
      if (isMatch) {
        //will return true if matched otherwise false
        let token = jwt.sign(
          //jwt will create a token using the secret key mention above and the user id
          {
            user: {
              id: existingUser.id,
            },
          },
          secretKey,
          {
            expiresIn: "1h",
          }
        );

        return res.status(200).json({
          sucess: true,
          message: "User logged in successcessfully!!",
          token: token,
        });
      } else {
        return res.status(403).json({
          sucess: false,
          message: "Incorrect password",
        });
      }
    });
    // if (existingUser.password === password) {
    //   res.status(201).json({
    //     success: true,
    //     message: "Logged in successcessfully!!",
    //   });
    // } else {
    //   res.status(403).send("Invalid password");
    // }
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Server Error!");
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, phoneNo, password, confirmPassword } = req.body;

    let existingUser;
    if (!email) {
      existingUser = await User.findOne({ phoneNo: phoneNo });
    } else {
      existingUser = await User.findOne({ email: email });
    }

    if (!existingUser) {
      return res.status(403).send("User not found.");
    }

    if (password === confirmPassword) {
      await User.updateOne(
        { _id: existingUser._id },
        { $set: { password: password } }
      );

      let user = await User.find({ _id: existingUser._id });

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
        data: user,
      });
    } else {
      res.status(403).send("Password did not match");
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Server Error!");
  }
};

//mobile verification
exports.signInWithMobile = async (req, res) => {
  try {
    const { mobileNo } = req.body;

    // let user = await User.findOne({ phoneNo: mobileNo });
    // console.log("check user", user);

    // if (!user) {
    //   return res.status(404).json({
    //     status: false,
    //     message: "User does not exist!",
    //   });
    // }

    client.verify
      .services(process.env.TWILIO_SERVICE_ID)
      .verifications.create({ to: mobileNo, channel: "sms" })
      .then((verification) => {
        if (verification) {
          res.status(200).json({
            success: true,
            message: "OTP sent to your phone, please check!",
          });
        }
      })
      .catch((error) => {
        if (error) {
          console.log("error", error);
          res.status(500).json({
            success: false,
            message: "Something went wrong, please try again!",
          });
        }
      });
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Server Error!");
  }
};


exports.verifyOTP = async(req,res)=> {
  try {
    const {mobileNo, otp} = req.body;

    client.verify
      .services(process.env.TWILIO_SERVICE_ID)
      .verificationChecks.create({ to: mobileNo, code: otp })
      .then(async(verification_check) => {
        if (verification_check.status === "approved") {
          res.status(200).json({
            success: true,
            message: "Login success!",
          });
        }
      })
      .catch((error) => {
        if (error) {
          console.log("error", error);
          res.status(500).json({
            success: false,
            message: "Something went wrong, please try again!",
          });
        }
      });
  } catch (error) {
    
  }
}