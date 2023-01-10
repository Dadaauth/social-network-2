const saveToUser = require("./embeds/message/savemessages/saveToUser");
const saveToFriend = require("./embeds/message/savemessages/saveToFriend");

function getMessagePost(req, res) {
    if(req.isAuthenticated()){
        saveToUser(req, res)
        .then(() => {
            saveToFriend(req, res)
            .then(() => {
                res.redirect("/message?fgId=" + req.query.fgId);
            });
        })
        .catch(err => {
            console.log("An Error Occured:=>", err);
        });
    } else{
        res.redirect("/login?url=message?fgId=" + req.query.fgId);
    }
}

// NOTE
/*
    create a friend list that friend list is the only people you can message
    then when freind requests are answered you can add them to the friend list.
*/

module.exports = getMessagePost;