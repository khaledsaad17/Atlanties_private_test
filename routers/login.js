const express = require('express');
const JWTWEBTOKEN = require('jsonwebtoken');
const User_model = require('../models/User_DB'); 
const Token = require('../models/User_Token_validation');
const bcrypt = require('bcrypt');
const router = express.Router();
const JWT_KEY = process.env.SECRET_KEY;




// محتاج اعمل تعديل علي حته انه لما يعمل Login ويكون فى token متهخزن من قبل كدا يعمل تعديل عليه ميضيفش علطول علشان انا عامل ال name unique فاا مش هيعرف يضيف token مضاف قبل كدا

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

        // create refresh token
        const token = new Token ({
            username : valid_email.username,
            refresh_token : JWTWEBTOKEN.sign({
            id : valid_email._id,
            name : valid_email.username,
            email : valid_email.email
        }, JWT_KEY , { expiresIn:"30d" }
        )});

        const result = await token.save();
        console.log(result)
        // create access token with little time 
        const access_token = JWTWEBTOKEN.sign({
            id : result._id,
            name : result.username,
        }, process.env.access_token_SECRET_KEY ,{ expiresIn:"1m" }
        )

        res.json({
            message: "Login successful",
            token: access_token
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal server error" });
    }
})




module.exports = router