const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        minlength: [3, "Username must be at least 3 characters long"],
        maxlength: [20, "Username cannot exceed 20 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    dateOfBirth: {
        type: Date,
        required: [true, "Date of birth is required"]
    },
    gender: {
        type: String,
        enum: ["male", "female"], // allowed values only
        required: [true, "Gender is required"]
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"]
    }, 
    age: {
        type: Number,
        min: [10, "Age must be at least 10"],
        max: [100, "Age cannot exceed 100"],
    },
    country:{
        type: String,
        required: [true, "country is required"]
    }
},{ timestamps: true });



const User = mongoose.model("users_info", userSchema);
module.exports = User