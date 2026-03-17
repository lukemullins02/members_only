const renderSignUp = (req, res) => res.render("sign-up-form");
const db = require("../db/queries");
const { genPassword, validPassword } = require("../lib/passwordUtils");
const { body, validationResult, matchedData } = require("express-validator");

const lengthErr = "must be 50 characters or less.";
const passwordErr = "Passwords don't match.";

const validateUser = [
  body("firstName")
    .isLength({ max: 50 })
    .withMessage(`First Name ${lengthErr}`),
  body("lastName").isLength({ max: 50 }).withMessage(`Last Name ${lengthErr}`),
  body("username"),
  body("password"),
  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage(`${passwordErr}`),
];

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

module.exports = {
  renderSignUp,
  createUser,
};
