function messages_route(app, Usermsgs){
    // ::::::::: Get Requests  ::::::::::::::: //
    app.get("/messages", (req, res) => {
        if(req.isAuthenticated()){
    
            Usermsgs.findOne({userId: req.user.id}, (err, found) => {
                if(found){
                    res.render("messages", {authenticated: true, username: req.user.username, messages: found.values});
                }
                else{
                    res.render("messages", {authenticated: true, username: req.user.username});
                }
            });
        } else{
            res.redirect("/login?url=messages");
        }
    });
    // ::::::::: Get Requests END  ::::::::::::::: //


    // ::::::::: Post Requests  ::::::::::::::: //


    // ::::::::: Post Requests END  ::::::::::::::: //
}
module.exports = messages_route;