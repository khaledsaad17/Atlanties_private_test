const express = require('express');
const User_feedback = require('../models/feedback_db');
const  { AuthMiddleware : authorization }  = require('../middleware/Auth');
const { route } = require('./login');
const router = express.Router();


router.post('/',authorization,async (req,res)=>{
    try {
        const {rate,feedback_text} = req.body;
        const result  = new User_feedback({
            username : req.user.name,
            rate,
            feedback_text
        });
        await result.save().then(data =>{
            console.log(data)
        });
        res.status(201).json({message:"User Feedback Stored Successfully"});

    } catch (err) {

        if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map(e => e.message)
        return res.status(400).json({ errors });
        }

        // this is for unique data 
        if (err.code === 11000) {
        const duplicateField = Object.keys(err.keyPattern)[0];
        return res.status(400).json({ errors: { [duplicateField]: `${duplicateField} already exists` } });
        }

        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
})

router.get('/', async (req,res)=>{
    const all_feedback = await User_feedback.find({},{updatedAt : 0 , _id : 0 ,__v : 0})
    .sort({createdAt : -1}) // order by Date
    console.log(`feedback length is ${all_feedback.length}`)
    res.status(201).json({values:all_feedback})
})

module.exports = router