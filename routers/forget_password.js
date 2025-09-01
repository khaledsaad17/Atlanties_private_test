const express = require('express');
const crypto = require('crypto');
const  User = require('../models/User_DB');
const sendEmail = require('../utils/SendEmail');
const bcrypt = require('bcrypt');
const forgotPasswordLimiter = require('../Controller/requests_rate_Limite');
const router = express.Router();


// لسا عايز اضيف عدد الريكوستات اللى تتبعت تبقى محدوده ف وقت معين علشان ال brute force attack 

router.post('/',forgotPasswordLimiter,async(req,res)=>{
    try {
        const {email} = req.body;
        const is_exist = await User.findOne({email});
        if (!is_exist) {
            res.status(201).json({message: "User Not Found "})
        }
        
        // create token
        const reset_token = crypto.randomBytes(32).toString('hex');
        
        // store token in user info database 
        is_exist.resetPasswordToken = crypto.createHash("sha256").update(reset_token).digest("hex");
        is_exist.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // valid for 10m
        await is_exist.save();
        
        // create link
        const resetURL = `http://localhost:6676/reset-password/${reset_token}`;
        
        // send mail
        await sendEmail(
            is_exist.email,
            "Password Reset", 
            `Please reset your password using this link: ${resetURL}`
        );
        res.json({ message: "Reset link sent to email successfully " });

    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Server error"})
    }

})

// accept token and check
router.post('/:token',async(req,res)=>{
    try {
        console.log(`this is token in params : ${req.params.token}`)
        const resetPasswordToken = crypto.createHash("sha256")
        .update(req.params.token)
        .digest("hex");

        const is_exist = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() } // لازم يكون لسه صالح
        });

        if (!is_exist) return res.status(400).json({ message: "Invalid or expired token" });
        
        const password = req.body.password;
        const re_password = req.body.re_password
        
        if (password !== re_password) {
            res.status(400).json({ message: "password are not equality" });
        }
        is_exist.password = await bcrypt.hash(password,10);
        is_exist.resetPasswordToken = "undefined";
        is_exist.resetPasswordExpire = undefined;
        await is_exist.save();

        res.json({ message: "Password reset successful" });

    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Server error"})
    }
})




module.exports = router