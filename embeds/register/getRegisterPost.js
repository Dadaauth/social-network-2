const formidable = require("formidable");
const { User } = require("../../modules/mongooseModels");

function getRegisterPost(req, res) {
    const options = {
        filter: function ({name, originalFilename, mimetype}) {
        // keep only images
        return mimetype && mimetype.includes("image");
        },
        uploadDir: "././public/images",
        keepExtensions : true
    };
    const form = formidable(options);
    form.parse(req, (err, fields, files) => {
        const first_name = fields.first_name;
        const last_name = fields.last_name;
        const username = last_name+" "+first_name;
        const email_address = fields.email;
        const phone_number = fields.phone_number;
        const age = fields.age;
        const date_of_birth = fields.date_of_birth;
        const profile_picture = files.profile_picture.newFilename;
        const password = fields.password;

        const user = new User({
            username: username,
            first_name: first_name,
            last_name: last_name,
            email_address: email_address,
            phone_number: phone_number,
            age: age,
            date_of_birth: date_of_birth,
            profile_picture: profile_picture,
            password: password,
        });
        user.save((err) => {
            if(!err){
                res.redirect("/login?message=Signup successful, please login!")
            }
        });
    });
}

module.exports = getRegisterPost;