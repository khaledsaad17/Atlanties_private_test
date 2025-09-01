
const rateLimit = require("express-rate-limit");

module.exports = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 5, // 5 محاولات فقط
    message: {
        status: "bad request",
        code: 400,
        message: "Too many requests, please try again after 15 minutes"
    },
    standardHeaders: true,  // يرجع RateLimit-* headers
    legacyHeaders: false    // يمنع X-RateLimit-* headers القديمة
});
