const db = require("../db/queries");
const { genPassword, validPassword } = require("../lib/passwordUtils");
const { body, validationResult, matchedData } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be 50 characters or less.";
const passwordErr = "Passwords don't match.";
const passwordLengthErr = "must be less than 128 characters.";
const emailErr = "Please enter valid email address ex: john@mail.com";

const validateUser = [
  body("firstName")
    .isAlpha()
    .withMessage(`${alphaErr}`)
    .isLength({ max: 50 })
    .withMessage(`First Name ${lengthErr}`),
  body("lastName").isLength({ max: 50 }).withMessage(`Last Name ${lengthErr}`),
  body("username").isEmail().withMessage(`${emailErr}`).normalizeEmail(),
  body("password")
    .isLength({ max: 128 })
    .withMessage(`Password ${passwordLengthErr}`),
  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage(`${passwordErr}`),
];

const renderSignUp = (req, res) => res.render("sign-up-form");

const createUser = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up-form", {
        errors: errors.array(),
      });
    }

    const { firstName, lastName, username, password } = matchedData(req);

    const { salt, hash } = genPassword(password);

    await db.insertUser(firstName, lastName, username, hash, salt);

    res.redirect("/");
  },
];

const renderJoinClub = (req, res) => res.render("join-club");

const postJoinClub = async (req, res) => {
  if (req.body.member === process.env.MEMBER_PWD) {
    console.log("Correct");
  } else {
    console.log("Wrong");
  }
};

module.exports = {
  renderSignUp,
  createUser,
  renderJoinClub,
  postJoinClub,
};
