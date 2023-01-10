const mongoose = require("mongoose");
// import mongoose Schemas
const { userSchema, usrmsgsSchema, postSchema } = require("./mongooseSchema.js");



const User = mongoose.model("User", userSchema);

const Usermsgs = mongoose.model("Usermsgs", usrmsgsSchema);

const Post = mongoose.model("Post", postSchema);

module.exports = { User, Usermsgs, Post };