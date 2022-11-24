// require packages
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

/////routing
// homepage for news feed
app.get("/", (req, res) => {
    res.render("index");
});
// messages page
app.get("/messages", (req, res) => {
    res.render("messages");
});





 







                                            ///////Register and Login ////////////

  
  

app.listen(3000, () => {console.log("app running on port 3000");});