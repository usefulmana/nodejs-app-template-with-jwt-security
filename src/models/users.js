const config = require("../../config.json");
const mongoose = require("../../config/db");

const UserSchema = mongoose.Schema({
    fullName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },   
}, {timestamps: true}, {versionKey: false});

module.exports = mongoose.model('user', UserSchema);