const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");

// models
const Idea = require("../../models/Idea");
const User = require("../../models/User");

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

// read JSON file
const ideas = JSON.parse(fs.readFileSync(`${__dirname}/ideas.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));

// import data into DB
const importData = async () => {
  try {
    await Idea.insertMany(ideas);
    await User.insertMany(users);

    console.log("👍👍👍👍👍👍 Data successfully loaded! 👍👍👍👍👍👍");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

// delete all data from DB
const deleteData = async () => {
  try {
    console.log("😢😢 Goodbye Data...");

    await Idea.deleteMany();
    await User.deleteMany();
    console.log(
      "Data successfully deleted! To load sample data, run\n\n\t npm run sample\n\n"
    );
    process.exit();
  } catch (err) {
    console.log(
      "\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n"
    );
    console.error(err);
    process.exit();
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
