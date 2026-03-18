module.exports.isAuth = (req, res, next) => {
  if (req.user) {
    if (req.user.status === true) {
      next();
    } else {
      res.send("Join the club to create messages");
    }
  } else {
    res.redirect("/login");
  }
};
