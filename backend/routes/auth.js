const express = require("express");
const User = require("../Models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();

const JWT_SECRET = "Kamlesh Borana (KB)";

//Route 1: Create a User using: POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  body("name", "Enter a valid name").isLength({ min: 3 }),
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password must atleast 5 characters").isLength({ min: 5 }),
  //If there are errors, return Bad request and the errors
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Previous code to save user data
    // const user = User(req.body);
    // user.save();

    //Handle any error using try catch statement
    try {
      // Check whether if a user with the same email already exists or not
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.json({
          error:
            "Sorry a user with the same email address already exists please use a diffrent email id",
        });
      }

      const salt = await bcrypt.genSalt();
      const secPass = await bcrypt.hash(req.body.password, salt);
      //Create a new User and save it to the database
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken });
      //   res.json(user);
    } catch (error) {
      console.error(error.message);
      res
        .status(500)
        .send("Sorry, the server is currently facing some issues!");
    }
  }
);

//Route 2: Login the user using: POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success,
          error: "Please enter valid credentials.",
        });
      }
      const passCompare = await bcrypt.compare(password, user.password);
      if (!passCompare) {
        return res.status(400).json({
          success,
          error: "Please enter valid credentials.",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      res.status(500).send("Internal server error!");
    }
  }
);

//Route 3: Get Loggedin user data using: POST "/api/auth/getuser". Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    res.status(500).send("Internal server error!");
  }
});

module.exports = router;
