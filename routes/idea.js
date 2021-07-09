const express = require("express");

const ideaController = require("../controllers/ideaController");
const { ensureAuthenticated } = require("../helpers/auth");

const router = express.Router();

router
  .route("/")
  .get(ensureAuthenticated, ideaController.getOverview)
  .post(ensureAuthenticated, ideaController.createIdea);

router.get("/add", ensureAuthenticated, ideaController.getIdeaForm);

router.get("/edit/:id", ensureAuthenticated, ideaController.getEditForm);

router
  .route("/:id")
  .put(ensureAuthenticated, ideaController.updateIdea)
  .delete(ensureAuthenticated, ideaController.deleteIdea);

module.exports = router;
