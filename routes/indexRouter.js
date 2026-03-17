const { Router } = require("express");
const passport = require("passport");

const {
  renderSignUp,
  createUser,
  renderJoinClub,
  postJoinClub,
  renderLogIn,
  renderMessages,
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
    successRedirect: "/join-club",
  }),
);

indexRouter.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

module.exports = indexRouter;
