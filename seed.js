require("dotenv").config();
const mongoose = require("mongoose");
const Question = require("./schemas/question.schema");

const questions = [
  {
    question: "When is the enrollment period?",
    answer: "The enrollment period is from November 1st to December 15th."
  },
  {
    question: "Where is the university located?",
    answer: "The university's address is 1234 Main Street, Anytown, USA 12345."
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("connected to mongo!");

    await Question.deleteMany({});

    await Question.insertMany(questions);
    console.log("seed - created questions");

    mongoose.connection.close();
    process.exit(0);

  } catch (err) {
    console.error(err);
  }
}

seed();


