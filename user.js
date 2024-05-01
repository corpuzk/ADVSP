const mongoose = require("mongoose");

//User object attributes
const userSchema = new mongoose.Schema({
    company: String,
    first: String,
    last: String,
    user: String,
    pass: String,
    isAdmin: Boolean 
});

const User = mongoose.model('User', userSchema);

module.exports = User;

