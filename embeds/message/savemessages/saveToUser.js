const mongoose = require("mongoose");
const { User, Usermsgs } = require("../../../modules/mongooseModels.js");

async function saveToUser(req, res) {

    // self invoking function

    (async function savetoUserFunc() {
        await Usermsgs.findOne({userId: req.user.id})
            .exec(async (err, found) => {
                    if(found != null){
                        /* since a user needs to have only one document, this option tells us that if the 
                        user already has a document then find a way to update it's records instead of creating a new document
                        */
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
                                    /*   
                                        this option checks if the person being messaged already exists in the database
                                        of the user. if it does exist then update the values so it holds the new message.
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
                                        await updateFriendInUser.apply(null, passArray)
                                    })().then(() => {
                                        if(process.env.DEPLOYSTATUS === "development"){
                                            console.log("update friend in user function called");
                                        }
                                    });
                                }   
                                else{
                                    /*   
                                        this option checks if the person being messaged already exists in the database
                                        of the user. if it does not exist then create a new values array for the friend.
                                        once this is created for that particular friend there won't be any need to go through
                                        this process again
                                    */
                                    var passArray = [
                                        req.user.id, type, 
                                        fgId, name, 
                                        picture, status, 
                                        day, month, 
                                        year, second, 
                                        minute, hour, 
                                        msgType, msgStatus, 
                                        message
                                    ];
                                    (async () => {
                                        await createFriendInUser.apply(null, passArray);
                                    })().then(() => {
                                        if(process.env.DEPLOYSTATUS === "development"){
                                            console.log("create friend in user function called");
                                        }
                                    });
                                }
                            });
                        });
                    } else{
                            /* since a user needs to have at least one document, this option tells us that
                            if there is no document created for the user before then create a new document and input it's values
                            */
                            var passArray = [
                                req.query.fgId, req.user.id, 
                                req.user.username, req.body.message
                            ];
                            (async () => {
                                await createUserDocuments.apply(null, passArray);
                            })().then(() => {
                                if(process.env.DEPLOYSTATUS === "development"){
                                    console.log("create new User documents function called");
                                }
                            });      
                    }
                });  
    })();
    
    // update friend detail in user database
    async function updateFriendInUser(
        found, reqUserId, 
        reqQueryFgid, msgType, 
        msgStatus, message, 
        day, month, 
        year, second, 
        minute, hour
    ) {
        // if the friends dcoument has been added before then update it.
        await found.values.forEach((foundValues) => {
            if(foundValues.fgId == reqQueryFgid){
                Usermsgs.findOneAndUpdate({userId: reqUserId, "values.fgId": reqQueryFgid}, 
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
                }}
                ).exec(async (err, done) => {
                    if(process.env.DEPLOYSTATUS === "development"){
                        if(err){
                            console.log("Error updating friend detail in user database:=>", err);
                        } else  {
                            console.log("Friend Detail Updated in User DataBase")
                        }
                    }
                });  
            }
        });  
    }
    
    
    // create friend detail in user database
    async function createFriendInUser(
        reqUserId, type, 
        fgId, name, 
        picture, status, 
        day, month, 
        year, second, 
        minute, hour, 
        msgType, msgStatus, 
        message
    ) {
        await Usermsgs.findOneAndUpdate({userId: reqUserId}, 
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
                        console.log("Error creating friend detail in user database:=>", err);
                    } else  {
                        console.log("Friend Detail Created in User DataBase")
                    }
                }
            });
    }
    
    
    // create new user documents if user has not messaged before
    async function createUserDocuments(
        reqQueryFgid, reqUserId, 
        reqUserUsername, reqBodyMessage
    ) {
        // create new documents if doesn't exist before.
        await User.findById({_id: reqQueryFgid})
         .exec(async (err, got) => {
            const userId = reqUserId;
            const username = reqUserUsername;
            const type = "friend";
            const fgId = reqQueryFgid;
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
                        console.log("Error Creating New User Documents:=>", err);
                    } else  {
                        console.log("New User Documents Created")
                    }
                }
            });
        });
    }
}

module.exports = saveToUser;