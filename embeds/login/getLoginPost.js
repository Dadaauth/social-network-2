const passport = require('passport');

function getLoginPost(app) {
    app.post("/login", 
    passport.authenticate('userLR', { failureRedirect: "/login?message=Incorrect Details!"}),
    (req, res) => {
        res.redirect("/" + req.query.url); 
    });
}

module.exports = getLoginPost;