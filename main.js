require('dotenv').config();
const  express = require('express');
const JWTWEBTOKEN = require('jsonwebtoken');
const handle_uncaughted_errors = require('./middleware/handle_errors')
const { AuthMiddleware : Auth , Validate_Token } = require('./middleware/Auth');


const app = express()
require('./StartUp/routes')(app)
require('./StartUp/mongo_db')();
require('./utils/logger');




// server listen
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))



app.get('/', (req, res) => res.header('khaled','saad').send('Hello World!'))

app.get('/protected',Auth,(req,res)=>{
    console.log("done you are authorized to Enter system ...........")
    res.status(201).json({user:req.user})
})


app.get('/refresh_token',Validate_Token,(req,res)=>{

        const access_token = JWTWEBTOKEN.sign({
            id : req.user.id,
            name : req.user.name,
        }, process.env.access_token_SECRET_KEY ,{ expiresIn:"1m" }
        )

        res.json({
            message: "new access token is generated successfully.....",
            token: access_token
        });

})

    // throw new Error("this is new error from end point api");


app.use('/error',(req,res,next)=>{
    // throw new Error("this is new error from end point api");
    const p = Promise.reject("this is test for rejection in promis")
    next();
})


// this is for handle defulte api endpoint
app.use((req,res)=>{
        res.status(404).json({message:"err 404 page not found"});
})

// setTimeout(() => {
//     const p = Promise.reject("this is test for rejection in promis")
// }, 5000);
// throw new Error("uncaughtexecption is happend in line 73")