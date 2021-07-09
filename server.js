const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION 🔥, Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");
dotenv.config({ path: "./variables.env" });

// db
const db = process.env.DATABASE;

// mongoDB connection
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log(`MongoDB Connected → ${db}`));

app.set("port", process.env.PORT || 5050);

const server = app.listen(app.get("port"), () =>
  console.log(`App listening on port → ${server.address().port}`)
);

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION 🔥, Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
