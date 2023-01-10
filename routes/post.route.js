function post_route(app, User, Post){
    // :::::GET Method:::::::: //
    app.get("/post", (req, res) => {
        if(req.isAuthenticated()){
            User.findOne({_id: req.user.id}, (err, foundUser) => {
                res.render("post", {authenticated: true, user: foundUser});
            });
        }
        else{
            res.redirect("/login?url=post");
        }
    });
    //  :::::GET Method End::::: // 
    // :::: POST Method:::: //
    app.post("/post", (req, res) => {
        async function savePost() {
            const options = {year: "numeric", month: "long", day: "numeric"};
            const d = new Date();
            const getTime = d.toLocaleTimeString("en-US", options);
            const uPost = req.body.post;
            const time = getTime;
            const post = new Post({
                userId: req.user.id,
                username: req.user.username,
                userPicture: req.user.profile_picture,
                post: uPost,
                time: time,
            });
            post.save();
        }
        savePost()
        .then(()=>{
            res.redirect("/");
        })
    });
    // :::::: POST Method End:::::: //
}
module.exports = post_route;