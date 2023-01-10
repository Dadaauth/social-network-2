function message_route(app, User, Usermsgs){
    // ::::::::: Get Requests  ::::::::::::::: //
    app.get("/message", (req, res) => {
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
    });
    // ::::::::: Get Requests END  ::::::::::::::: //


    // ::::::::: Post Requests  ::::::::::::::: //
    app.post("/message", (req, res) => {
        if(req.isAuthenticated()){
            // save to own account
    
            Usermsgs.findOne({userId: req.user.id}, (err, found) => {
    
                if(found != null){
            
                    // update the records
                    User.findById({_id: req.query.fgId}, (err, got) => {
                        const userId = req.user.id;
                        const username = req.user.username;
                        const type = "friend";
                        const fgId = req.query.fgId;
                        const name = got.username;
                        const picture = got.profile_picture;
                        const status = "read";
                        /**** ****/
                        const d = new Date();
                        const day = d.getDate();
                        const month = d.getMonth() + 1;
                        const year = d.getFullYear();
                        const second = d.getSeconds();
                        const minute = d.getMinutes();
                        const hour = d.getHours();
                        /**** ****/
                        const msgType = "sent";
                        const msgStatus = "read";   
                        const message = req.body.message;
                    
                        Usermsgs.findOne({userId: req.user.id, "values.fgId": req.query.fgId}, (err, found) => {
    
                
                                
                                if(found != null){
                                    found.values.forEach((foundValues) => {
                                        if(foundValues.fgId == req.query.fgId){
                                            Usermsgs.findOneAndUpdate({userId: req.user.id, "values.fgId": req.query.fgId}, 
                                            {$push: {
                                                "values.$.message": [{
                                                    msgType: msgType,
                                                    status: msgStatus,
                                                    message: message,
                                                    date: [{
                                                        day: day,
                                                        month: month, 
                                                        year: year,
                                                    }],
                                                    time: [{
                                                        second: second,
                                                        minute: minute, 
                                                        hour: hour,
                                                    }],
                                                }],
                                            }},
                                            (err, done) => {
                                                // if(done){
                                                //     console.log("successful");
                                                // }else{
                                                //     console.log("error encountered", err)
                                                // }
                                            });  
                                        }
                                    });  
                                }   
                                else{
                                    // if not available create a new values array.
                    
                                    Usermsgs.findOneAndUpdate({userId: req.user.id}, 
                                    {$push: {
                                        values: [{
                                            fgType: type,
                                            fgId: fgId,
                                            name: name,
                                            picture: picture,
                                            status: status,
                                            date: [{
                                                day: day,
                                                month: month, 
                                                year: year,
                                            }],
                                            time: [{
                                                second: second,
                                                minute: minute, 
                                                hour: hour,
                                            }],
                                            message: [{
                                                msgType: msgType,
                                                status: msgStatus,
                                                message: message,
                                                date: [{
                                                    day: day,
                                                    month: month, 
                                                    year: year,
                                                }],
                                                time: [{
                                                    second: second,
                                                    minute: minute, 
                                                    hour: hour,
                                                }],
                                            }], 
                                        }],
                                    }},
                                    (err, done) => {
                                        // if(done){
                                        //     console.log("Succesful");
                                        // }else{
                                        //     console.log("error encountered!", err);
                                        // }
                                    });
                                }
                        });
                });
    
                } else{
                    // create new documents if doesn't exist before.
                    User.findById({_id: req.query.fgId}, (err, got) => {
                        const userId = req.user.id;
                        const username = req.user.username;
                        const type = "friend";
                        const fgId = req.query.fgId;
                        const name = got.username;
                        const picture = got.profile_picture;
                        const status = "read";
                        /**** ****/
                        const d = new Date();
                        const day = d.getDate();
                        const month = d.getMonth() + 1;
                        const year = d.getFullYear();
                        const second = d.getSeconds();
                        const minute = d.getMinutes();
                        const hour = d.getHours();
                        /**** ****/
                        const msgType = "sent";
                        const msgStatus = "read";   
                        const message = req.body.message;
                        const newUserMsgs = new Usermsgs({
                            userId: userId,
                            username: username,
                            values: [{
                                fgType: type,
                                fgId: fgId,
                                name: name,
                                picture: picture,
                                status: status,
                                date: [{
                                    day: day,
                                    month: month, 
                                    year: year,
                                }],
                                time: [{
                                    second: second,
                                    minute: minute, 
                                    hour: hour,
                                }],
                                message: [{
                                    msgType: msgType,
                                    status: msgStatus,
                                    message: message,
                                    date: [{
                                        day: day,
                                        month: month, 
                                        year: year,
                                    }],
                                    time: [{
                                        second: second,
                                        minute: minute, 
                                        hour: hour,
                                    }],
                                }], 
                            }],
                        });
                        newUserMsgs.save((err) => {
                            // if(err){
                            //     console.log("Error: " + err);
                            // }else{
                            //     console.log("successful");
                            // }
                        });
                    });
                }
            });
    
    
        // save to friend account
    
        Usermsgs.findOne({userId: req.query.fgId}, (err, found) => {
            if(found != null){
            //     // update the records
                User.findById({_id: req.query.fgId}, (err, got) => {
                    const userId = req.query.fgId;
                    const username = got.username;
                    const type = "friend";
                    const fgId = req.user.id;
                    const name = req.user.username;
                    const picture = req.user.profile_picture;
                    const status = "unread";
                    /**** ****/
                    const d = new Date();
                    const day = d.getDate();
                    const month = d.getMonth() + 1;
                    const year = d.getFullYear();
                    const second = d.getSeconds();
                    const minute = d.getMinutes();
                    const hour = d.getHours();
                    /**** ****/
                    const msgType = "recieved";
                    const msgStatus = "unread";   
                    const message = req.body.message;
                
                    Usermsgs.findOne({userId: req.query.fgId, "values.fgId": req.user.id}, (err, found) => {
                        if(found != null){
                            found.values.forEach((foundValues) => {
                                if(foundValues.fgId == req.user.id){
                                    Usermsgs.findOneAndUpdate({userId: req.query.fgId, "values.fgId": req.user.id}, 
                                    {$push: {
                                        "values.$.message": [{
                                            msgType: msgType,
                                            status: msgStatus,
                                            message: message,
                                            date: [{
                                                day: day,
                                                month: month, 
                                                year: year,
                                            }],
                                            time: [{
                                                second: second,
                                                minute: minute, 
                                                hour: hour,
                                            }],
                                        }],
                                    }},
                                    (err, done) => {
                                        // if(done){
                                        //     console.log("Succesful");
                                        // } else{
                                        //     console.log("error encountered");
                                        // }
                                    });
                                }
                            });
                            
                            
                        }else{
                             // if not available create a new values array.
                             Usermsgs.findOneAndUpdate({userId: req.query.fgId}, 
                                {$push: {
                                    values: [{
                                        fgType: type,
                                        fgId: fgId,
                                        name: name,
                                        picture: picture,
                                        status: status,
                                        date: [{
                                            day: day,
                                            month: month, 
                                            year: year,
                                        }],
                                        time: [{
                                            second: second,
                                            minute: minute, 
                                            hour: hour,
                                        }],
                                        message: [{
                                            msgType: msgType,
                                            status: msgStatus,
                                            message: message,
                                            date: [{
                                                day: day,
                                                month: month, 
                                                year: year,
                                            }],
                                            time: [{
                                                second: second,
                                                minute: minute, 
                                                hour: hour,
                                            }],
                                        }], 
                                    }],
                                }},
                                (err, done) => {
                                    // if(done){
                                    //     console.log("Succesful");
                                    // }else{
                                    //     console.log("error encountered!");
                                    // }
                                });
                        }
                    });
            });
                
    
            }else{
                // create new document if doesn't exist before
                User.findById({_id: req.query.fgId}, (err, got) => {
                    const userId = req.query.fgId;
                    const username = got.username;
                    const type = "friend";
                    const fgId = req.user.id;
                    const name = req.user.username;
                    const picture = req.user.profile_picture;
                    const status = "unread";
                    /**** ****/
                    const d = new Date();
                    const day = d.getDate();
                    const month = d.getMonth() + 1;
                    const year = d.getFullYear();
                    const second = d.getSeconds();
                    const minute = d.getMinutes();
                    const hour = d.getHours();
                    /**** ****/
                    const msgType = "recieved";
                    const msgStatus = "unread";   
                    const message = req.body.message;
                    const newUserMsgs = new Usermsgs({
                        userId: userId,
                        username: username,
                        values: [{
                            fgType: type,
                            fgId: fgId,
                            name: name,
                            picture: picture,
                            status: status,
                            date: [{
                                day: day,
                                month: month, 
                                year: year,
                            }],
                            time: [{
                                second: second,
                                minute: minute, 
                                hour: hour,
                            }],
                            message: [{
                                msgType: msgType,
                                status: msgStatus,
                                message: message,
                                date: [{
                                    day: day,
                                    month: month, 
                                    year: year,
                                }],
                                time: [{
                                    second: second,
                                    minute: minute, 
                                    hour: hour,
                                }],
                            }], 
                        }],
                    });
                    newUserMsgs.save((err) => {
                        // if(!err){
                        //     console.log("Successful");
                        // }else{
                        //     console.log("Error: " + err);
                        // }
                    });
                });
            }
        });
        res.redirect("/message?fgId=" + req.query.fgId);
    }else{
        res.redirect("/login?url=message?fgId=" + req.query.fgId);
    }
    
    });
    // ::::::::: Post Requests END  ::::::::::::::: //
}
module.exports = message_route;