const { User } = require("../../modules/mongooseModels.js");

function getPostPage(req, res) {
    if(req.isAuthenticated()){
        User.findOne({_id: req.user.id}, (err, foundUser) => {
            res.render("post", {authenticated: true, user: foundUser});
        });
    }
    else{
        res.redirect("/login?url=post");
    }
}

module.exports = getPostPage;