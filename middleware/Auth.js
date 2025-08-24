const  jwt = require('jsonwebtoken');
const Refresh_Token = require('../models/User_Token_validation');
const SECRET_KEY = process.env.SECRET_KEY;

function AuthMiddleware(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({
            message: 'No Authorization Header'
        })
    }
    try {
        const token = authorization.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({
                message: 'Invalid Token Format'
            })
        }
        const decode = jwt.verify(token, process.env.access_token_SECRET_KEY);
        req.user = decode
        next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: 'Session Expired',
                error: error.message,
            })
        }
        if (error instanceof jwt.JsonWebTokenError || error instanceof TokenError) {
            return res.status(401).json({
                message: 'Invalid Token',
                error: error.message,
            })
        }
        // هنا دا بيوضع اى اللى حصل قبل الخطاء واسبابه اى يساعد ع تحليل الخطاء
        console.error(`stack: ${error.stack}`);
        res.status(500).json({
            message: 'Internal server Error',
            error: error.message,
        });
    }
}

async function Validate_Token(req,res,next) {
    const { username } = req.body;
    console.log(username)
    const isvalid_user = await Refresh_Token.findOne({username})
    if (!isvalid_user) {
        return res.status(401).json({
                message: 'Session Expired please login again'
            })
    }
    try {
        const decode = jwt.verify( isvalid_user.refresh_token , SECRET_KEY );
        req.user = decode;
        next();
    } catch (err) {
        return res.status(401).json({
                message: 'Session Expired please login again',
                error: err.message,
            })
    }
}

module.exports = {AuthMiddleware,Validate_Token}