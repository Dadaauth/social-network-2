function login_route(app){
    // ::::::::: Get Requests  ::::::::::::::: //
    // get login page
    app.get("/login", (req, res) => {
        if(req.isAuthenticated()){
            res.redirect("back");
        } else{
            if(req.query.message){
                res.render("login", {loginType: "email", authenticated: false, url: " ", message: req.query.message});
            }
            else{
                if(req.query.url){
                    res.render("login", {loginType: "email", authenticated: false, url: req.query.url});
                }else{
                    res.render("login", {loginType: "email", authenticated: false, url: " "});
                }
            }
        }
    });
    // get logout page
    app.get("/logout", (req, res) => {
        req.logout(function(err) {
            if (err) { return next(err); }
            });
            res.redirect("/login");
    });
    // ::::::::: Get Requests END  ::::::::::::::: //


    // ::::::::: Post Requests  ::::::::::::::: //
    const passport = require("passport")
    app.post("/login", 
    passport.authenticate('userLR', { failureRedirect: "/login?message=Incorrect Details!"}),
    (req, res) => {
    res.redirect("/" + req.query.url); 
    });
    // ::::::::: Post Requests END  ::::::::::::::: //
}
module.exports = login_route;