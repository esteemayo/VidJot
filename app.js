const mongoSanitize = require("express-mongo-sanitize");
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
const compression = require("compression");
const flash = require("connect-flash");
const passport = require("passport");
const express = require("express");
const logger = require("morgan");
const helmet = require("helmet");
const xss = require("xss-clean");
const path = require("path");

// requiring route
const globalErrorHandler = require("./middlewares/error");
const AppError = require("./utils/appError");
const ideaRoute = require("./routes/idea");
const userRoute = require("./routes/user");
const viewRoute = require("./routes/view");

// passport config
require("./config/passport")(passport);

const app = express();

// set security HTTP headers
app.use(helmet());

// development logging
if (app.get("env") === "development") {
  app.use(logger("dev"));
}

// handlebars middleware
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
  })
);

app.set("view engine", "handlebars");

// express body-parser middleware
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.json({ limit: "10kb" }));

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xss());

// public folder
app.use(express.static(path.join(__dirname, "public")));

// method-override niddleware
app.use(methodOverride("_method"));

// express session
app.use(
  require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// flash
app.use(flash());

// compression middleware
app.use(compression());

// global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.user = req.user || null;

  next();
});

// routes
app.use("/", viewRoute);
app.use("/ideas", ideaRoute);
app.use("/users", userRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
