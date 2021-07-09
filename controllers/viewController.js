exports.home = (req, res, next) => {
  res.status(200).render("index", {
    title: "Welcome",
  });
};

exports.about = (req, res, next) => {
  res.status(200).render("about");
};
