const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const profile = require("../../models/Profile");
const user = require("../../models/User");

//@route GET api/profile/me
//@desc get current users profile
//@access private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route POST api/profile
//@desc create and update users profile
//@access private
router.post(
  "/",
  [
    auth,
    [
      check("status", "status is required")
        .not()
        .isEmpty(),
      check("skills", "skills is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      location,
      bio,
      githubusername,
      status,
      skills,
      facebook,
      instagram,
      youtube
    } = req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;
    if (status) profileFields.status = status;
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    //Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    // if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({user:req.user.id})

      if(profile){
        //Update
        profile = await Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new:true});

        return res.json(profile);
      }

      //Create
      profile = new Profile(profileFields);
      await profile.save();

      return res.json(profile);

    } catch (error) {
      console.error(err.message);
      return res.status(500).send("server error");
    }
  }
);

//@route GET api/profile
//@desc get all profiles
//@access public
router.get('/',async (req,res)=>{
      try {
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
});

//@route GET api/profile/user/:user_id
//@desc get profile by user id
//@access public
router.get('/user/:user_id',async (req,res)=>{
  try {
    const profile = await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);

    if(!profile){
      return res.status(400).json({msg: "Profile not found"});
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if(err.kind=='ObjectId'){
      return res.status(400).json({msg: "Profile not found"});
    }
    res.status(500).send("Server Error");
  }
});

//@route DELETE api/profile
//@desc delete profile,user and posts
//@access private
router.delete('/',auth,async (req,res)=>{
  try {
    
    //remove Profile
    await Profile.findOneAndRemove({user:req.user.id});
    //remove User
    await User.findOneAndRemove({_id:req.user.id});

    res.json({msg:"user deleted"});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
