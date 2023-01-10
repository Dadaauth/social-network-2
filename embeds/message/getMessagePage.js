const { User, Usermsgs } = require("../../modules/mongooseModels");

function getMessagePage(req, res) {
    if(req.isAuthenticated()){

        if(req.query.fgId){
            Usermsgs.findOne({userId: req.user.id, "values.fgId": req.query.fgId}, (err, found) => {
                User.findOne({_id: req.query.fgId}, (err, fgss) => {
                    if(fgss){
                        if(found != null){
                            res.render("message", {
                                authenticated: true, 
                                username: req.user.username, 
                                userpic: req.user.profile_picture,
                                fgId: req.query.fgId,
                                fgDetails: fgss,
                                msgValues: found.values
                            });
                        }else{
                            res.render("message", {
                                authenticated: true, 
                                username: req.user.username, 
                                fgDetails: fgss,
                                fgId: req.query.fgId,
                            });
                        }
                    }
                    else{
                        res.redirect("/messages");
                    }
                });
            });
        } else{
            res.redirect("/messages");
        }


    }else{
        res.redirect("/login?url=message?fgId=" + req.query.fgId);
    }
}

function getMessagesPage(req, res) {
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
}

module.exports = { getMessagePage, getMessagesPage };