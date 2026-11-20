const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    displayName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: "email",
    usernameLowerCase: true,
});

module.exports = mongoose.model("User", userSchema);
