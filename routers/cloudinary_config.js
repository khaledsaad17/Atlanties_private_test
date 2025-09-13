const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const express = require('express');
const router = express.Router();
const fs = require('fs')
const Room_image = require('../models/rooms_images')

const descriptions = require('../helper');

function getRandomDescription() {
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_Key,
    api_secret: process.env.CLOUD_API_Secret
});


const upload = multer({ dest: 'image_uploads/' }); // هتتحفظ محليًا مؤقتًا

router.post('/', upload.array('images',), async (req, res) => {

    try {
        let image_obj=[];

        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'my_project_uploads'
            });
            
            const store_in_db = new Room_image({
                image_url:result.secure_url,
                number_of_people:2  ,
                view:"Garden or city",
                features:["wi-fi"],
                price: Math.floor(Math.random() * (150 - 50 + 1)) + 50,
                description:getRandomDescription(),
                country : "Egypt",
                city :"Alexandria"
            });
            image_obj.push( await store_in_db.save() )

            // امسح الصورة من السيرفر بعد الرفع 
            fs.unlinkSync(file.path);
        }

        res.json({ message: 'تم رفع الصور بنجاح!', image_obj });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'فشل الرفع' });
    }
});


module.exports = router