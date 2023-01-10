function home_route(app, User, Post) {

  // ::::::::: Get Requests  ::::::::::::::: //
  app.get("/", (req, res) => {
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
  });
  // ::::::::: Get Requests END  ::::::::::::::: //


  // ::::::::: Post Requests  ::::::::::::::: //


  // ::::::::: Post Requests END  ::::::::::::::: //
}
module.exports = home_route;