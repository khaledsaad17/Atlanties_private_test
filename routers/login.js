const express = require('express');
const JWTWEBTOKEN = require('jsonwebtoken');
const User_model = require('../models/User_DB'); 
const Token = require('../models/User_Token_validation');
const bcrypt = require('bcrypt');
const loginLimiter = require('../Controller/requests_rate_Limite');
const router = express.Router();
const JWT_KEY = process.env.SECRET_KEY;




// محتاج اعمل تعديل علي حته انه لما يعمل Login ويكون فى token متهخزن من قبل كدا يعمل تعديل عليه ميضيفش علطول علشان انا عامل ال name unique فاا مش هيعرف يضيف token مضاف قبل كدا

router.post('/',loginLimiter,async (req,res)=>{
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
        }, JWT_KEY , { expiresIn : "30d" }
        )});

        // here update the data in db if exist
        const update_refresh_token = await Token.findOneAndUpdate(
            { username : valid_email.username }, // hrer we add filter
            { refresh_token : token.refresh_token },   // here the update we want to add
            { new: true }
        )
        if ( !update_refresh_token ) {
            const result = await token.save();
            var access_token = CreateAccessToken( result._id , result.username )
        }else{
            access_token = CreateAccessToken( 
                update_refresh_token._id , 
                update_refresh_token.username )
            
        }

        res.json({
            message: "Login successful",
            token: access_token
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal server error" });
    }
})


function CreateAccessToken(id,name) {
    // create access token with little time 
        return JWTWEBTOKEN.sign({
            id ,
            name ,
        }, process.env.access_token_SECRET_KEY ,{ expiresIn:"1h" })
}

module.exports = router

