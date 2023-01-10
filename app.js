// require packages
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const passportCustom = require("passport-custom");
const CustomStrategy = passportCustom.Strategy;
const formidable = require("formidable");
const fs = require("fs");
const getHomePage = require("./embeds/homepage/getHomePage");
const { getLoginPage, getLogoutPage } = require("./embeds/login/getLoginPage");
const getLoginPost = require("./embeds/login/getLoginPost");
const getRegisterPage = require("./embeds/register/getRegisterPage");
const getRegisterPost = require("./embeds/register/getRegisterPost");
const { getMessagePage, getMessagesPage } = require("./embeds/message/getMessagePage");
const { getProfilePage, getSettingsPage } = require("./embeds/profile/getProfilePage");
const savePosts = require("./embeds/posts/saveposts");
const getPostPage = require("./embeds/posts/getPostPage");

// import mongoose model 
const { User, Usermsgs, Post } = require("./modules/mongooseModels.js");

const app = express();
// // connect to mongoose
// // mongoose.connect("mongodb+srv://authority:4141clement%3F@cluster0.gs6bw9m.mongodb.net/socialiteDB");
mongoose.connect("mongodb://localhost:27017/socialiteDB");
// // get mongoose client
const mongooseClient = mongoose.connection.getClient();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// express session and passport connecting to the session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    name: "socialite",
    store: MongoStore.create({  
        client: mongooseClient,
        touchAfter: 24 * 3600,
        crypto: {
            secret: process.env.SECRET,
          }
    })
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use('userLR', new CustomStrategy(
    function(req, done) {
        User.findOne({
            email_address: req.body.email,
            password: req.body.password
        }, (err, user) => {
            done(err, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

app.get("/", (req, res) => {
    getHomePage(req, res);
});

app.get("/login", (req, res) => {
    getLoginPage(req, res);
});

getLoginPost(app);

app.get("/logout", (req, res, next) => {
    getLogoutPage(req, res, next);
});

app.get("/message", (req, res) => {
    getMessagePage(req, res);
});

app.post("/message", (req, res) => {
    getMessagePost(req, res);
});

app.get("/messages", (req, res) => {
    getMessagesPage(req, res);
});

app.get("/post", (req, res) => {
    getPostPage(req, res);
});

app.post("/post", (req, res) => {
    savePosts(req, res);
});

app.get("/profile", (req, res) => {
    getProfilePage(req, res);
});

app.get("/settings", (req, res) => {
    getSettingsPage(req, res);
});

app.get("/signup", (req, res) => {
    getRegisterPage(req, res);
});

app.post("/signup", (req, res) => {
    getRegisterPost(req, res);
});


app.listen(3001, () => {console.log("app running on port 3001");});