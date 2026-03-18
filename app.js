const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const assetsPath = path.join(__dirname, "public");
const pool = require("./db/pool");
require("dotenv").config();
require("./config/passport");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));

const PGStore = require("connect-pg-simple")(session);

const sessionStore = new PGStore({ pool: pool, tableName: "session" });

app.use(
  session({
    store: sessionStore,
    secret: "some secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

app.use("/", indexRouter);

const PORT = 3000;

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Listening on port ${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});
