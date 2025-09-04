const mongoose = require('mongoose');
const feedbacke_Schema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        minlength: [3, "Username must be at least 3 characters long"],
        maxlength: [20, "Username cannot exceed 20 characters"]
    },
    rate:{
        type:Number,
        enum:[1,2,3,4,5],
        required: [true, "Rate is required"],
        min: [1, "Rate must be at least 1 number long"],
        max: [5, "Rate cannot exceed 5 number"]
    },
    feedback_text:{
        type:String,
        required: [true, "feedback text is required"],
    },
    
},{ timestamps: true })

const Feedback = mongoose.model('User_feedback',feedbacke_Schema);


module.exports = Feedback