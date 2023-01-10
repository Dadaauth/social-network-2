const mongoose = require("mongoose");
const { User, Usermsgs } = require("../../../modules/mongooseModels.js");


async function saveToFriend(req, res) {

    // self invoking function

    (async function saveToFriendFunc() {
        await Usermsgs.findOne({userId: req.query.fgId})
            .exec(async (err, found) => {
            if(found != null){
                /* 
                    this section checks if the friend already has a document of it's own. if it
                    does, then it tries to update the documents the friend has.
                */
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
                            /*
                                this section checks if the user has a section of documents in the friends database. 
                                if it does it executes this section which says that those details should be updated 
                                and the new message should be pushed inside.
                            */
                            var passArray = [
                                found, req.user.id, 
                                req.query.fgId, msgType,
                                msgStatus, message, 
                                day, month, 
                                year, second, 
                                minute, hour
                            ];
                            (async () => {
                                await updateUserInFriend.apply(null, passArray);
                            })().then(() => {
                                if(process.env.DEPLOYSTATUS === "development"){
                                    console.log("Update User in friend function called");
                                }
                            });
                        }else{
                             /*
                                this section checks if the user has a section of documents in the friends database. 
                                if the user does not have an documents inside the friends database it executes this
                                section which says that new documents should be created for the user in the friends 
                                database and the new message should be pushed inside.
                            */
                            var passArray = [
                                type, fgId, 
                                name, picture, 
                                status, day, 
                                month, year, 
                                second, minute,
                                hour, msgType, 
                                msgStatus, message
                            ];
                            (async () => {
                                await createUserInFriend.apply(null, passArray);
                            })().then(() => {
                                if(process.env.DEPLOYSTATUS === "development"){
                                    console.log("Create User in friend function called");
                                }
                            });
                        }
                    });
            });
                
    
            }else{
                /* 
                    this section checks if the friend already has a document of it's own. if it
                    does not have, then it creates a new document for the friend.
                */
                var passArray = [
                    req.query.fgId, req.user.id, 
                    req.user.username, req.body.message
                ];
                (async () => {
                    await createFriendDocuments.apply(null, passArray);
                })().then(() => {
                    if(process.env.DEPLOYSTATUS === "development"){
                        console.log("Create friend documents function called");
                    }
                });
            }
        });
    })();
    

    
    // update user details in friend database
    async function updateUserInFriend(
        found, reqUserId, 
        reqQueryFgid, msgType, 
        msgStatus, message, 
        day, month, 
        year, second, 
        minute, hour
    ) {
        await found.values.forEach((foundValues) => {
            if(foundValues.fgId == reqUserId){
                Usermsgs.findOneAndUpdate({userId: reqQueryFgid, "values.fgId": reqUserId}, 
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
                }})
                .exec(async (err, done) => {
                    if(process.env.DEPLOYSTATUS === "development"){
                        if(err){
                            console.log("Error updating user detail in friend database:=>", err);
                        } else  {
                            console.log("User Detail Updated in friend DataBase")
                        }
                    }
                });
            }
        });
    }
    

    // create user details in friend database
    async function createUserInFriend(
        type, fgId, 
        name, picture, 
        status, day, 
        month, year, 
        second, minute, 
        hour, msgType, 
        msgStatus, message
    ) {
        await Usermsgs.findOneAndUpdate({userId: fgId}, 
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
            }})
            .exec(async (err, done) => {
                if(process.env.DEPLOYSTATUS === "development"){
                    if(err){
                        console.log("Error creating user detail in friend database:=>", err);
                    } else  {
                        console.log("User Detail Created in Friend DataBase")
                    }
                }
            });
    }
    

    // create new friend documents if friend has not messaged before
    async function createFriendDocuments(
        reqQueryFgid, reqUserId, 
        reqUserUsername, reqBodyMessage
    ) {
        await User.findById({_id: reqQueryFgid})
         .exec(async (err, got) => {
            const userId = reqQueryFgid;
            const username = got.username;
            const type = "friend";
            const fgId = reqUserId;
            const name = reqUserUsername;
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
            const message = reqBodyMessage;
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
            await newUserMsgs.save((err) => {
                if(process.env.DEPLOYSTATUS === "development"){
                    if(err){
                        console.log("Error Creating New Friend Documents:=>", err);
                    } else  {
                        console.log("New Friend Documents Created")
                    }
                }
            });
        });
    }
};


module.exports = saveToFriend;