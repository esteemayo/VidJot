const passport = require("passport");

exports.login = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout();
  req.flash("success_msg", "You're now logged out");
  res.redirect("/users/login");
};

exports.loginForm = (req, res, next) => {
  res.status(200).render("users/login");
};
