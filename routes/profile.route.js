function profile_route(app, User){
    // ::::::::: Get Requests  ::::::::::::::: //
    // get profile page
    app.get("/profile", (req, res) => {
        if(req.isAuthenticated()){
            User.findOne({_id: req.user.id}, (err, foundUser) => {
                res.render("profile", {authenticated: true, user: foundUser});
            });
        } else{
            res.redirect("/login?url=profile");
        }
    });
    // get setting page
    app.get("/settings", (req, res) => {
        if(req.isAuthenticated()){
            res.render("settings", {authenticated: true, username: req.user.username});
        } else{
           res.render("settings", {authenticated: false}); 
        }
    }) ;
    // ::::::::: Get Requests END  ::::::::::::::: //


    // ::::::::: Post Requests  ::::::::::::::: //


    // ::::::::: Post Requests END  ::::::::::::::: //
    
}
module.exports = profile_route;