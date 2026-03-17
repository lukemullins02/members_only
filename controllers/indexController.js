const renderSignUp = (req, res) => res.render("sign-up-form");
const db = require("../db/queries");
const { genPassword, validPassword } = require("../lib/passwordUtils");

const createUser = async (req, res) => {
  const { firstName, lastName, username, password } = req.body;

  const { salt, hash } = genPassword(password);

  await db.insertUser(firstName, lastName, username, hash, salt);

  res.redirect("/");
};

module.exports = {
  renderSignUp,
  createUser,
};
