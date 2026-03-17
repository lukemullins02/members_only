const { Router } = require("express");

const {
  renderSignUp,
  createUser,
  renderJoinClub,
  postJoinClub,
} = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", (req, res, next) => {
  res.send("Hello World!");
});

indexRouter.get("/sign-up", renderSignUp);

indexRouter.post("/sign-up", createUser);

indexRouter.get("/join-club", renderJoinClub);

indexRouter.post("/join-club", postJoinClub);

module.exports = indexRouter;
