const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

//@route  POST api/users
//@desc   register user
//@access public
router.post(
  "/",
  [
    check("name", "Please enter a name")
      .not()
      .isEmpty(),
    check("email", "please enter a valid email").isEmail(),
    check(
      "password",
      "please enter a password with more than 6 characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors= validationResult(req);
    if(!errors.isEmpty()){
       return res.status(400).json({errors:errors.array()});
    }
    res.send("user route");
  }
);

module.exports = router;
