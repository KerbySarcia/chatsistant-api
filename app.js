require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

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
