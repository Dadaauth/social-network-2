const { Post } = require("../../modules/mongooseModels.js");

async function savePosts(req, res) {
    (async function savePost() {
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
        await post.save();
    })()
    .then(()=>{
        res.redirect("/");
    })
}

module.exports = savePosts;