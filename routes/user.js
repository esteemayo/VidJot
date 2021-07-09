const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.route("/login").get(authController.loginForm).post(authController.login);

router
  .route("/register")
  .get(userController.registerForm)
  .post(userController.register);

router.get("/logout", authController.logout);

module.exports = router;
