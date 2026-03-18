const { Router } = require("express");
const passport = require("passport");

const {
  renderSignUp,
  createUser,
  renderJoinClub,
  postJoinClub,
  renderLogIn,
  renderMessages,
  renderCreateMessage,
  postCreateMessage,
} = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", renderMessages);

indexRouter.get("/sign-up", renderSignUp);

indexRouter.post("/sign-up", createUser);

indexRouter.get("/join-club", renderJoinClub);

indexRouter.post("/join-club", postJoinClub);

indexRouter.get("/login", renderLogIn);

indexRouter.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/",
  }),
);

indexRouter.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

indexRouter.get("/create-message", renderCreateMessage);

indexRouter.post("/create-message", postCreateMessage);

indexRouter.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

module.exports = indexRouter;
