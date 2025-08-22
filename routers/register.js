const express = require('express');
const User_model = require('../models/User_DB');
const bcrypt = require('bcrypt');
const { parsePhoneNumberFromString } = require("libphonenumber-js");
const router = express.Router();

router.get('/khaled',(req,res)=>{
    res.send("khaled is here")
})

router.post('/',async(req,res)=>{

    try {
        console.log(req.body)
        const {
        username,
        email,
        password,
        rePassword,
        dateOfBirth,
        gender,
        phoneNumber,
        } = req.body;

        console.log("khaled saad")
        // تحقق من إعادة كتابة الباسورد
        if (password !== rePassword) {
        return res.status(400).json({ errors: { rePassword: "Passwords do not match" } });
        }

        //  تحقق من رقم الموبايل
        const phone = parsePhoneNumberFromString(phoneNumber);
        console.log(phone)
        console.log(phone.isValid())
        
        if (!phone.isValid() || phone.number.length != 13 ) {
        return res.status(400).json({ errors: { phoneNumber: "Invalid phone number with country code" } });
        }

        // صيغة قياسية E.164 (زي +2010...)
        const formattedPhone = phone.number;
        // الدولة (مثلاً EG, SA, US...)
        const country = phone.country;

        // حساب العمر من تاريخ الميلاد 
        const age = CalculateAge(dateOfBirth)

        // hashing password
        const password_hash = await bcrypt.hash(password,10)
        // إنشاء مستخدم جديد
        const user = new User_model({
        username,
        email,
        password:password_hash,
        dateOfBirth,
        gender,
        age,
        phoneNumber: formattedPhone,
        country
        });

        await user.save();

        res.status(200).json({
        message: "User created successfully",
        user
        });

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

        console.log(err)
        res.status(500).json({ error: "Server error" });
    }

})


function CalculateAge(birth_date) {
    const user_birth_date = new Date(birth_date)
    const today_date = new Date()
    return today_date.getFullYear() - user_birth_date.getFullYear();
}


module.exports = router;