const { User } = require("../../modules/mongooseModels");

function getProfilePage(req, res) {
    if(req.isAuthenticated()){
        User.findOne({_id: req.user.id}, (err, foundUser) => {
            res.render("profile", {authenticated: true, user: foundUser});
        });
    } else{
        res.redirect("/login?url=profile");
    }
}

function getSettingsPage(req, res) {
    if(req.isAuthenticated()){
        res.render("settings", {authenticated: true, username: req.user.username});
    } else{
       res.render("settings", {authenticated: false}); 
    }
}

module.exports = { getProfilePage, getSettingsPage };