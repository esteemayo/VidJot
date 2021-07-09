const Idea = require("../models/Idea");
const catchErrors = require("../utils/catchErrors");

exports.getOverview = catchErrors(async (req, res, next) => {
  const ideas = await Idea.find({ user: req.user.id }).sort({ date: "desc" });

  res.status(200).render("ideas/index", {
    ideas,
  });
});

exports.createIdea = catchErrors(async (req, res, next) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ msg: "Please add a title" });
  }

  if (!req.body.details) {
    errors.push({ msg: "Please add some details" });
  }

  if (errors.length > 0) {
    return res.status(400).render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details,
    });
  }

  const newIdea = new Idea({
    title: req.body.title,
    details: req.body.details,
    user: req.user.id,
  });

  await newIdea.save();
  req.flash("success_msg", "Video idea added.");
  res.redirect("/ideas");
});

exports.getEditForm = catchErrors(async (req, res, next) => {
  const idea = await Idea.findOne({ _id: req.params.id });

  if (idea.user !== req.user.id) {
    req.flash("error_msg", "Not Authorized!");
    return res.redirect("/ideas");
  }

  return res.status(200).render("ideas/edit", { idea });
});

exports.updateIdea = catchErrors(async (req, res, next) => {
  const idea = await Idea.findOne({
    _id: req.params.id,
  });

  idea.title = req.body.title;
  idea.details = req.body.details;

  await idea.save();

  req.flash("success_msg", "Video idea updated.");
  res.redirect("/ideas");
});

exports.deleteIdea = catchErrors(async (req, res, next) => {
  await Idea.deleteOne({ _id: req.params.id });

  req.flash("success_msg", "Video idea deleted.");
  res.redirect("/ideas");
});

exports.getIdeaForm = (req, res, next) => {
  res.status(200).render("ideas/add");
};
