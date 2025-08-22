const express = require('express');
const JWTWEBTOKEN = require('jsonwebtoken');
const User_model = require('../models/User_DB'); 
const bcrypt = require('bcrypt');
const router = express.Router();
const JWT_KEY = process.env.SECRET_KEY;



router.post('/',async (req,res)=>{
    try {
        const {email,password} = req.body;
        const valid_email = await User_model.findOne({email}).select({username:1,email:1,password:1});
        console.log(valid_email);
        if (!valid_email) {
            return res.status(400).json({ message: "User Not Exist" });
        }
        const isMatch = await bcrypt.compare(password,valid_email.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = JWTWEBTOKEN.sign({
            id : valid_email._id,
            name:valid_email.username,
            email : valid_email.email
        }, JWT_KEY , { expiresIn:"30d" }
        );

        res.json({
            message: "Login successful",
            token: token
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal server error" });
    }
})




module.exports = router