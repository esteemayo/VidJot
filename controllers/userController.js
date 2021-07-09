const bcrypt = require("bcryptjs");

const catchErrors = require("../utils/catchErrors");
const User = require("../models/User");

exports.register = catchErrors(async (req, res, next) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ text: "Please all required fields must be filled." });
  }

  if (password !== password2) {
    errors.push({ text: "Password do not match." });
  }

  if (password.length < 4) {
    errors.push({ text: "Password must be at least 4 characters." });
  }

  if (errors.length > 0) {
    return res.status(400).render("users/register", {
      errors,
      name,
      password,
      password2,
    });
  }

  const user = await User.findOne({ email });
  if (user) {
    req.flash("error_msg", "Email already registered.");
    return res.redirect("/users/register");
  }

  const newUser = new User({
    name,
    email,
    password,
  });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newUser.password, salt);

  newUser.password = hash;
  await newUser.save();

  req.flash("success_msg", "You're now registered and can log in.");
  res.redirect("/users/login");
});

exports.registerForm = (req, res, next) => {
  res.status(200).render("users/register");
};
