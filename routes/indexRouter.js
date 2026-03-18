const { Router } = require("express");
const passport = require("passport");
const { isAuth } = require("../controllers/authController");

const {
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
    failureRedirect: "/login",
    failureMessage: true,
    successRedirect: "/",
  }),
);

indexRouter.get("/login-failure", (req, res) => {
  console.log(req.body);
  res.send("Username or password were incorrect.");
});

indexRouter.get("/create-message", isAuth, renderCreateMessage);

indexRouter.post("/create-message", postCreateMessage);

indexRouter.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

indexRouter.get("/admin", renderAdmin);

indexRouter.post("/admin", postAdmin);

indexRouter.get("/:id/delete", deleteMessage);

indexRouter.get("/{*splat}", renderError);

module.exports = indexRouter;
