const mongoose = require('mongoose');

const Token_Schema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "Username is required"],
        unique: true,
        minlength: [3, "Username must be at least 3 characters long"],
        maxlength: [20, "Username cannot exceed 20 characters"]
    },
    refresh_token:{
        type:String,
        required: true,
        minlength: [150, "token must be at least 150 characters long"],
        maxlength: [300, "token cannot exceed 300 characters"]
    }
})

const Token = mongoose.model('token_validation',Token_Schema);


module.exports = Token