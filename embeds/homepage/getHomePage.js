const { Post, User } = require("../../modules/mongooseModels.js");

function getHomePage(req, res) {
    if(req.isAuthenticated()){
        User.find({}, (err, users) => {
          Post.find({}, (err, posts) => {
            Post.countDocuments({}, (err, count) => {
              if(count > 0){
                res.render("index", {authenticated: true, user_id: req.user.id, username: req.user.username, users: users, posts: posts});     
              }else{
                res.render("index", {authenticated: true, user_id: req.user.id, username: req.user.username, users: users});     
              }
            });
          });
        });
    }
    else{
        res.redirect("/login")
    }
}

module.exports = getHomePage;