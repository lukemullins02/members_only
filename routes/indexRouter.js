const { Router } = require("express");

const { renderSignUp, createUser } = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", (req, res, next) => {
  res.send("Hello World!");
});

indexRouter.get("/sign-up", renderSignUp);

indexRouter.post("/sign-up", createUser);

module.exports = indexRouter;
