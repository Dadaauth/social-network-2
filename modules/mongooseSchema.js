const mongoose = require("mongoose");
//**************** */ NOTE ******************//

/*

ADD I TO THE END OF THE SCHEMA FUNCTIONS SO THAT YOU CAN CALL IT BEFORE PASSING IT OVER AS AN EXPORT

*/



//**************** */ NOTE ******************//

// // user mongoose schema
function userSchemai() {
    const userSchema = new mongoose.Schema({
        username: String,
        first_name: String,
        last_name: String,
        email_address: String,
        phone_number: String,
        age: Number,
        date_of_birth: String,
        password: String,
        profile_picture: String,
        friends: Number,
        posts: Number,
        groups: Number,
    });
    return userSchema;
}
// // user messaging schema
function usrmsgsSchemai() {
    const usrmsgsSchema = new mongoose.Schema({
        userId: String,
        username: String,
        values: [{
            fgType: String,
            fgId: String,
            name: String,
            picture: String,
            status: String,
            date: [{
                day: Number,
                month: Number, 
                year: Number,
            }],
            time: [{
                second: Number,
                minute: Number, 
                hour: Number,
            }],
            message: [{
                msgType: String,
                status: String,
                message: String,
                date: [{
                    day: Number,
                    month: Number, 
                    year: Number,
                }],
                time: [{
                    second: Number,
                    minute: Number, 
                    hour: Number,
                }],
            }], 
        }],
    });
    return usrmsgsSchema;
}

// posting Schema
function postSchemai() {
    const postSchema = new mongoose.Schema({
        userId: String,
        username: String,
        userPicture: String,
        post: String,
        time: String,
    });
    return postSchema;
}

const [ userSchema, usrmsgsSchema, postSchema ] = [ userSchemai(), usrmsgsSchemai(), postSchemai() ];

module.exports = { userSchema, usrmsgsSchema, postSchema }