require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

// Routers
const CONVERSATION_ROUTER = require("./routers/conversation.router");
const KNOWLEDGE_ROUTER = require("./routers/knowledge.router");
const USER_ROUTER = require("./routers/user.router");
const AUTH_ROUTER = require("./routers/auth.router");
const INQUIRY_ROUTER = require("./routers/inquries.router");

// app.use(cors());
app.use(cors({ origin: "https://chatsistant-staging-front.onrender.com" }));
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

app.use("/conversations", CONVERSATION_ROUTER);
app.use("/knowledges", KNOWLEDGE_ROUTER);
app.use("/users", USER_ROUTER);
app.use("/auth", AUTH_ROUTER);
app.use("/inquiries", INQUIRY_ROUTER);

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
