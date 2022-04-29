const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const userRouter = require("./src/routes/user.routes");

app.use(bodyParser.json());

let database = [];
let movieId = 0;
let userId = 0;

app.all("*", (req, res, next) => {
  const method = req.method;
  console.log(`Method ${method} is aangeroepen`);
  next();
});

app.use(userRouter);

app.all("*", (req, res) => {
  res.status(401).json({
    status: 401,
    result: "End-point not found",
  });
});

app.use((err, req, res, next) => {
  res.status(err.status).json(err)
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;