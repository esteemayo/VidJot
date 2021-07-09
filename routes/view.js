const express = require("express");

const viewController = require("../controllers/viewController");

const router = express.Router();

router.get("/", viewController.home);

router.get("/about", viewController.about);

module.exports = router;
