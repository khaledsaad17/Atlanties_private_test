const express = require('express');
const Room_info = require('../models/rooms_images');

const router = express.Router();




router.get('/',async(req,res)=>{
    const result = await Room_info.aggregate( [ 
        { 
            $sample : { size : 10 } 
        }, 
        {
            $project :{ country:0 , city:0 }
        } 
    ] )
    res.json({result})

})




module.exports = router


