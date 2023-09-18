require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

// Routers
const QUESTION_ROUTER = require("./routers/question.router");
const CONVERSATION_ROUTER = require("./routers/conversation.router");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  bodyParser.json({
    limit: "5mb",
    verify: (req, _, buff, __) => {
      req.bodyPlainText = buff.toString();
      return true;
    },
  })
);

app.use("/questions", QUESTION_ROUTER);
app.use("/c", CONVERSATION_ROUTER);

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(DB_URL, connectionOptions);
mongoose.connection.on("error", (err) => console.log("mongo_error => ", err));
mongoose.connection.once("open", () => console.log("Successfully connected"));

app.listen(PORT, () => {
  console.log(`RUNNING ON PORT ${PORT}`);
});
