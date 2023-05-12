const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const jwtSecretKey = process.env.JWT_SECRETKEY; //secrect key should be same as that mentioned in service

exports.isValid = async (req, res, next) => {
  console.log("here");
  // Get token from header
  //Verify token
  try {
    const token = req.header("Authorization"); //header name, this will return a key value pair containing token as the value of this header
    //Check if not token
    if (!token) {
      //check if token is received or not
      return res.status(401).json({ msg: "No Token, authrization denied" });
    }
    const decoded = jwt.verify(token, jwtSecretKey); //we will decode the token with the help of secrect key
    //when we created a token then we used the id and secrect key, so for decoding also it will require secrect key and give us id
    req.user = decoded.user;
    let user = await User.findOne({ _id: req.user.id }); //we will find the user with help of data i.e. id fetched
    if (user) {
      //if we get the user then we can proceed to the next fnction
      next(); //next will proceed to the next function in the queue i.e when we called this function in routes, it had a controller function alligned next to it. that will be invoked
    } else {
      return res.status(401).json({ msg: "User not exist anymore" });
    }
    // console.log(req.user)
  } catch (err) {
    console.log(err);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
