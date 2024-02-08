require('dotenv').config()
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://yourchoicesahil:ewPD0BsRe0hEKAF8@samskara-db.1tc5abk.mongodb.net/URL_Shortener")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    urls: [{ type: mongoose.Schema.Types.ObjectId, ref: 'URL' }]
});

const URLSchema = mongoose.Schema({
    urlCode: {
        type: String,
        required: true
    },
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: Date.now
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true }
});

const User = mongoose.model("User",userSchema);
console.log(User);
const URL = mongoose.model("URL",URLSchema);

module.exports = {
    User,
    URL
}