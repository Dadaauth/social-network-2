// require packages
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// express session and passport connecting to the session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// connect to mongoose
// mongoose.connect("mongodb+srv://authority:4141clement%3F@cluster0.gs6bw9m.mongodb.net/socialiteDB");
    mongoose.connect("mongodb://localhost:27017/socialiteDB");

// user mongoose schema
const userSchema = new mongoose.Schema({
    username: String,
    first_name: String,
    last_name: String,
    email_address: String,
    phone_number: String,
    age: Number,
    date_of_birth: String,
    password: String,
    profile_picture: String,
    friends: Number,
    posts: Number,
    groups: Number
});

// add user schema plugins
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
// define User model
const User = mongoose.model("User", userSchema);

// for passport login and signup authentication
passport.use(User.createStrategy());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
            return cb(null, {
        id: user.id,
        username: user.username,
        email_address: user.email_address,
        picture: user.picture,
        facebookId: user.facebookId,
        facebookName: user.facebookName,
        googleId: user.googleId
      });
      
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });
// passport authentication END


// user messaging schema
const usrmsgsSchema = new mongoose.Schema({
    userId: String,
    username: String,
    values: [{
        fgType: String,
        fgId: String,
        name: String,
        picture: String,
        status: String,
        date: [{
            day: Number,
            month: Number, 
            year: Number,
        }],
        time: [{
            second: Number,
            minute: Number, 
            hour: Number,
        }],
        message: [{
            msgType: String,
            status: String,
            message: String,
            date: [{
                day: Number,
                month: Number, 
                year: Number,
            }],
            time: [{
                second: Number,
                minute: Number, 
                hour: Number,
            }],
        }], 
    }],
});

// user messaging model creation
const Usermsgs = mongoose.model("Usermsgs", usrmsgsSchema);

/////Routing
// server GET Requests
// homepage for news feed
app.get("/", (req, res) => {
    User.find({}, (err, users) => {
        if(!err){
            if(req.isAuthenticated()){
                res.render("index", {authenticated: true, username: req.user.username, users: users});
            } else {
                res.render("index", {authenticated: false, users: users});
            }
        }
    });
});
// messages
app.get("/messages", (req, res) => {
    if(req.isAuthenticated()){
        console.log(req.user.email_address);
        res.render("messages", {type: "gn-messages", authenticated: true, username: req.user.username});
    } else{
        res.redirect("/login?url=messages");
    }
});
app.get("/message", (req, res) => {
    if(req.isAuthenticated()){
        if(req.query.fgId){   //change this to check if the user to be messaged with that id exists!
            res.render("messages", {
                type: "ps-messages", 
                authenticated: true, 
                username: req.user.username, 
                fgId: req.query.fgId
            });
        } else{
            res.redirect("/");
        }
    }else{
        res.redirect("/login?url=message?fgId=" + req.query.fgId);
    }
});
// profile page
app.get("/profile", (req, res) => {
    if(req.isAuthenticated()){
        res.render("profile", {authenticated: true, username: req.user.username});
    } else{
        res.render("profile", {authenticated: false});
    }
});
// login page
// login with username
app.get("/login", (req, res) => {
    if(req.isAuthenticated()){
        res.redirect("back");
    } else{
        if(req.query.url){
            res.render("login", {loginType: "username", authenticated: false, url: req.query.url});
        }else{
            res.render("login", {loginType: "username", authenticated: false, url: " "});
        }
    }
});
// login with email
app.get("/login-email", (req, res) => {
    if(req.isAuthenticated()){
        res.redirect("back");
    } else{
        if(req.query.url){
            res.render("login", {loginType: "email", authenticated: false, url: req.query.url});
        }else{
            res.render("login", {loginType: "email", authenticated: false, url: " "});
        }
    }
});
// sign up page
app.get("/signup", (req, res) => {
    if(req.isAuthenticated()){
        res.redirect("back");
    } else{
       res.render("register", {authenticated: false}); 
    }
});
// settings page
app.get("/settings", (req, res) => {
    if(req.isAuthenticated()){
        res.render("settings", {authenticated: true, username: req.user.username});
    } else{
       res.render("settings", {authenticated: false}); 
    }
}) ;
app.get("/logout", (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        });
        res.redirect("/login");
});



// server POST Requests
// signup POST request
app.post("/signup", (req, res) => {
    // let only lowercase of the first name and last name be saved to the database and no space between them.
    const username = req.body.last_name + " " + req.body.first_name;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email_adddress = req.body.email;
    const phone_number = req.body.phone_number;
    const age = req.body.age;
    const date_of_birth = req.body.date_of_birth;
    const password = req.body.password;
    const profile_picture = req.body.profile_picture;
    
    User.register({
        username: username, 
        first_name: first_name, 
        last_name: last_name, 
        email_adddress: email_adddress, 
        phone_number: phone_number,
        age: age,
        date_of_birth: date_of_birth,
        profile_picture: profile_picture,
    }, password, (err, user) => {
        if(err){
            res.render("sign_up_err");
        } else{
            res.redirect("/");
        }
    });
});
  
// login POST request  
app.post("/login", (req, res) => {

 if(req.query.type === "username"){
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function(err){
        if(err){
            console.log(err);
        } else {
            passport.authenticate("local")
            (req, res, function(err){
                if(err){
                    console.log(err);
                }
                res.redirect("/" + req.query.url);
            });
        }
    }); 
 }
    
 if(req.query.type === "email"){
    const user = new User({
        email_address: req.body.email,
        password: req.body.password
    });
    req.login(user, function(err){
        if(err){
            console.log(err);
        } else {
            passport.authenticate("local")
            (req, res, function(err){
                if(err){
                    console.log(err);
                }
                res.redirect("/" + req.query.url);
            });
        }
    }); 
 }
       
});
// messaging POST requests
app.post("/message", (req, res) => {
    if(req.isAuthenticated()){
        // save to own account

        Usermsgs.findOne({userId: req.user.id}, (err, found) => {

            if(found != ""){
                // update the records
                User.findById({_id: req.query.fgId}, (err, got) => {
                    const userId = req.user.id;
                    const username = req.user.username;
                    const type = "friend";
                    const fgId = req.query.fgId;
                    const name = got.username;
                    const picture = got.profile_picture;
                    const status = "read";
                    /**** ****/
                    const d = new Date();
                    const day = d.getDate();
                    const month = d.getMonth() + 1;
                    const year = d.getFullYear();
                    const second = d.getSeconds();
                    const minute = d.getMinutes();
                    const hour = d.getHours();
                    /**** ****/
                    const msgType = "sent";
                    const msgStatus = "read";   
                    const message = req.body.message;
                
                    Usermsgs.findOne({"values.fgId": req.query.fgId}, (err, found) => {
                        if(found != ""){
                            Usermsgs.findOneAndUpdate({userId: req.user.id, "values.fgId": req.query.fgId}, 
                            {$push: {
                                "values.$.message": [{
                                    msgType: msgType,
                                    status: msgStatus,
                                    message: message,
                                    "date.$.day": day,
                                    "date.$.month": month,
                                    "date.$.year": year,
                                    "time.$.second": second,
                                    "time.$.minute": minute,
                                    "time.$.hour": hour,
                                }],
                            }},
                            (err, done) => {
                                if(done){
                                    console.log("successful");
                                }else{
                                    console.log("error encountered")
                                }
                            });

                           
                            
                        }else{
                            // if not available create a new values array.
                            Usermsgs.findOneAndUpdate({userId: req.user.id}, 
                            {$push: {
                                values: [{
                                    fgType: type,
                                    fgId: fgId,
                                    name: name,
                                    picture: picture,
                                    status: status,
                                    date: [{
                                        day: day,
                                        month: month, 
                                        year: year,
                                    }],
                                    time: [{
                                        second: second,
                                        minute: minute, 
                                        hour: hour,
                                    }],
                                    message: [{
                                        msgType: msgType,
                                        status: msgStatus,
                                        message: message,
                                        date: [{
                                            day: day,
                                            month: month, 
                                            year: year,
                                        }],
                                        time: [{
                                            second: second,
                                            minute: minute, 
                                            hour: hour,
                                        }],
                                    }], 
                                }],
                            }},
                            (err, done) => {
                                if(done){
                                    console.log("Succesful");
                                }else{
                                    console.log("error encountered!");
                                }
                            });
                        }
                    });
            });

            } else{
                // create new documents if doesn't exist before.
                User.findById({_id: req.query.fgId}, (err, got) => {
                    const userId = req.user.id;
                    const username = req.user.username;
                    const type = "friend";
                    const fgId = req.query.fgId;
                    const name = got.username;
                    const picture = got.profile_picture;
                    const status = "read";
                    /**** ****/
                    const d = new Date();
                    const day = d.getDate();
                    const month = d.getMonth() + 1;
                    const year = d.getFullYear();
                    const second = d.getSeconds();
                    const minute = d.getMinutes();
                    const hour = d.getHours();
                    /**** ****/
                    const msgType = "sent";
                    const msgStatus = "read";   
                    const message = req.body.message;
                    const newUserMsgs = new Usermsgs({
                        userId: userId,
                        username: username,
                        values: [{
                            fgType: type,
                            fgId: fgId,
                            name: name,
                            picture: picture,
                            status: status,
                            date: [{
                                day: day,
                                month: month, 
                                year: year,
                            }],
                            time: [{
                                second: second,
                                minute: minute, 
                                hour: hour,
                            }],
                            message: [{
                                msgType: msgType,
                                status: msgStatus,
                                message: message,
                                date: [{
                                    day: day,
                                    month: month, 
                                    year: year,
                                }],
                                time: [{
                                    second: second,
                                    minute: minute, 
                                    hour: hour,
                                }],
                            }], 
                        }],
                    });
                    newUserMsgs.save();
                });
            }
        });


    // save to friend account

    Usermsgs.findOne({userId: req.query.fgId}, (err, found) => {
        if(found != ""){
            
            // update the records
            User.findById({_id: req.query.fgId}, (err, got) => {
                const userId = req.query.fgId;
                const username = got.username;
                const type = "friend";
                const fgId = req.user.id;
                const name = req.user.username;
                const picture = req.user.profile_picture;
                const status = "unread";
                /**** ****/
                const d = new Date();
                const day = d.getDate();
                const month = d.getMonth() + 1;
                const year = d.getFullYear();
                const second = d.getSeconds();
                const minute = d.getMinutes();
                const hour = d.getHours();
                /**** ****/
                const msgType = "recieved";
                const msgStatus = "unread";   
                const message = req.body.message;
            
                Usermsgs.findOne({"values.fgId": req.user.id}, (err, found) => {
                    if(found != ""){
                        Usermsgs.findOneAndUpdate({userId: req.query.fgId, "values.fgId": req.user.id}, 
                        {$push: {
                            "values.$.message": [{
                                msgType: msgType,
                                status: msgStatus,
                                message: message,
                                "date.$.day": day,
                                "date.$.month": month,
                                "date.$.year": year,
                                "time.$.second": second,
                                "time.$.minute": minute,
                                "time.$.hour": hour,
                            }],
                        }},
                        (err, done) => {
                            if(done){
                                console.log("Succesful");
                                res.redirect("/message?fgId=" + req.query.fgId);
                            } else{
                                console.log("error encountered");
                            }
                        });

                        
                        
                    }else{
                         // if not available create a new values array.
                         Usermsgs.findOneAndUpdate({userId: req.query.fgId}, 
                            {$push: {
                                values: [{
                                    fgType: type,
                                    fgId: fgId,
                                    name: name,
                                    picture: picture,
                                    status: status,
                                    date: [{
                                        day: day,
                                        month: month, 
                                        year: year,
                                    }],
                                    time: [{
                                        second: second,
                                        minute: minute, 
                                        hour: hour,
                                    }],
                                    message: [{
                                        msgType: msgType,
                                        status: msgStatus,
                                        message: message,
                                        date: [{
                                            day: day,
                                            month: month, 
                                            year: year,
                                        }],
                                        time: [{
                                            second: second,
                                            minute: minute, 
                                            hour: hour,
                                        }],
                                    }], 
                                }],
                            }},
                            (err, done) => {
                                if(done){
                                    console.log("Succesful");
                                }else{
                                    console.log("error encountered!");
                                }
                            });
                    }
                });
        });
            

        }else{
            // create new document if doesn't exist before
            User.findById({_id: req.query.fgId}, (err, got) => {
                const userId = req.query.fgId;
                const username = got.username;
                const type = "friend";
                const fgId = req.user.id;
                const name = req.user.username;
                const picture = req.user.profile_picture;
                const status = "unread";
                /**** ****/
                const d = new Date();
                const day = d.getDate();
                const month = d.getMonth() + 1;
                const year = d.getFullYear();
                const second = d.getSeconds();
                const minute = d.getMinutes();
                const hour = d.getHours();
                /**** ****/
                const msgType = "recieved";
                const msgStatus = "unread";   
                const message = req.body.message;
                const newUserMsgs = new Usermsgs({
                    userId: userId,
                    username: username,
                    values: [{
                        fgType: type,
                        fgId: fgId,
                        name: name,
                        picture: picture,
                        status: status,
                        date: [{
                            day: day,
                            month: month, 
                            year: year,
                        }],
                        time: [{
                            second: second,
                            minute: minute, 
                            hour: hour,
                        }],
                        message: [{
                            msgType: msgType,
                            status: msgStatus,
                            message: message,
                            date: [{
                                day: day,
                                month: month, 
                                year: year,
                            }],
                            time: [{
                                second: second,
                                minute: minute, 
                                hour: hour,
                            }],
                        }], 
                    }],
                });
                newUserMsgs.save((err) => {
                    if(!err){
                        res.redirect("/message?fgId=" + req.query.fgId)
                    }
                });
            });
        }
    });
    
}else{
    res.redirect("/login?url=message?fgId=" + req.query.fgId);
}

});

app.listen(3000, () => {console.log("app running on port 3000");});