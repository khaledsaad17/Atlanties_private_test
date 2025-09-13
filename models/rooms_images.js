const mongoose = require('mongoose');


const rooms_images = new mongoose.Schema({
    image_url:{
        type:String,
    },
    number_of_people:{
        type:Number
    },
    view:{
        type:String
    },
    features:{
        type:[String]
    },
    price:{
        type:Number
    },
    description:{
        type:String
    },
    country:{
        type:String
    },
    city:{
        type:String
    }
})

const Image = mongoose.model('room_images',rooms_images);

module.exports = Image