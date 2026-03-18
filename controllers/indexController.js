const db = require("../db/queries");
const { genPassword, validPassword } = require("../lib/passwordUtils");
const { body, validationResult, matchedData } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be 50 characters or less.";
const passwordErr = "Passwords don't match.";
const passwordLengthErr = "must be less than 128 characters.";
const emailErr = "Please enter valid email address ex: john@mail.com.";
const memberErr = "Please enter correct club password.";
const adminErr = "Please enter correct admin password.";
const msgErr = "must be 200 characters or less.";

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

const validateMember = [
  body("member")
    .equals(`${process.env.MEMBER_PWD}`)
    .withMessage(`${memberErr}`),
];

const validateAdmin = [
  body("admin").equals(`${process.env.ADMIN_PWD}`).withMessage(`${adminErr}`),
];

const validateMessage = [
  body("text").isLength({ max: 200 }).withMessage(`${msgErr}`),
];

const createUser = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req).array();

    if (errors.length != 0) {
      return res.status(400).render("sign-up-form", {
        errors: errors,
      });
    }

    const { firstName, lastName, username, password } = matchedData(req);

    const userExist = await db.getUser(username);

    if (userExist) {
      errors.push({ msg: "Email already registered" });
      return res.status(400).render("sign-up-form", {
        errors: errors,
      });
    }

    const { salt, hash } = genPassword(password);

    await db.insertUser(firstName, lastName, username, hash, salt);

    res.redirect("/");
  },
];

const renderSignUp = (req, res) => {
  if (!req.user) {
    res.render("sign-up-form");
  } else {
    res.redirect("/");
  }
};

const renderJoinClub = (req, res) => {
  if (!req.user) {
    res.redirect("/login");
  } else {
    res.render("join-club");
  }
};

const postJoinClub = [
  validateMember,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("join-club", {
        errors: errors.array(),
      });
    }

    await db.updateUser(req.user.id);
    res.redirect("/");
  },
];

const renderLogIn = (req, res) => {
  const errorMessages = req.session.messages;
  req.session.messages = [];
  if (!req.user) {
    res.render("login-form", { messages: errorMessages });
  } else {
    res.redirect("/");
  }
};

const renderMessages = async (req, res) => {
  if (!req.user) {
    res.redirect("/login");
  } else {
    if (req.user.status === true) {
      const messages = await db.getMessagesUsers();
      res.render("messages", {
        messages: messages,
        user: req.user,
      });
    } else {
      const messages = await db.getMessages();
      res.render("messages", {
        messages: messages,
        user: req.user,
      });
    }
  }
};

const renderCreateMessage = (req, res) => {
  if (!req.user) {
    res.redirect("/login");
  } else {
    res.render("message-form");
  }
};

const postCreateMessage = [
  validateMessage,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("message-form", {
        errors: errors.array(),
      });
    }

    const { text } = matchedData(req);
    const added = Intl.DateTimeFormat("en-US", {
      timeStyle: "short",
      dateStyle: "short",
    }).format(new Date());

    await db.insertMessage(text, added, req.user.id);
    res.redirect("/");
  },
];

const renderAdmin = (req, res) => {
  if (!req.user) {
    res.redirect("/login");
  } else {
    res.render("admin");
  }
};

const postAdmin = [
  validateAdmin,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("admin", {
        errors: errors.array(),
      });
    }

    await db.updateAdmin(req.user.id);
    res.redirect("/");
  },
];

const deleteMessage = async (req, res) => {
  console.log(req.params.id);
  await db.deleteMsg(req.params.id);
  res.redirect("/");
};

const renderError = (req, res) => {
  res.send(
    "Invalid URL. Try https://mem-only.up.railway.app/ to get back to home or login.",
  );
};

module.exports = {
  renderSignUp,
  createUser,
  renderJoinClub,
  postJoinClub,
  renderLogIn,
  renderMessages,
  renderCreateMessage,
  postCreateMessage,
  renderAdmin,
  postAdmin,
  deleteMessage,
  renderError,
};
