module.exports.isAuth = (req, res, next) => {
  if (req.user) {
    if (req.user.status === true) {
      next();
    } else {
      res.render("auth-page");
    }
  } else {
    res.redirect("/login");
  }
};
