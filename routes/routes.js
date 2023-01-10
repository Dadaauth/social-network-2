const home_route = require("./home.route.js");
const messages_route = require("./messages.route.js");
const message_route = require("./message.route.js");
const profile_route = require("./profile.route.js");
const login_route = require("./login.route.js");
const register_route = require("./register.route.js");
const post_route = require("./post.route");

function routes(app, User, Usermsgs, formidable, Post){
    home_route(app, User, Post)
    messages_route(app, Usermsgs)
    message_route(app, User, Usermsgs)
    profile_route(app, User)
    login_route(app)
    register_route(app, User, formidable)
    post_route(app, User, Post);
}
module.exports = routes;