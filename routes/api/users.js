const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar =  require("gravatar");
const bcrypt = require('bcryptjs');

const User = require("../../models/User");

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "user already exits" }] });
      }

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      user = new User({
        name,
        email,
        password,
        avatar
      });

      const salt= await bcrypt.genSalt(10);

      user.password= await bcrypt.hash(password,salt);

      await user.save();

      res.send("user registered");
    } catch (error) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;