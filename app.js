//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect("mongodb://127.0.0.1/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    if (!err) {
      const newUser = new User({
        email: req.body.username,
        password: hash,
      });
      newUser
        .save()
        .then(function () {
          res.render("secrets");
        })
        .catch(function (e) {
          console.log(e);
        });
    }
  });
});

app.post("/login", function (req, res) {
  const username = req.body.username;

  User.findOne({ email: username }).then(function (foundUser) {
    bcrypt.compare(
      req.body.password,
      foundUser.password,
      function (err, result) {
        if (result == true) {
          res.render("secrets");
        } else {
          console.log("Incorrect passwort!");
        }
      }
    );
  });
});

app.listen(3000, function () {
  console.log("server is up on port 3000");
});
