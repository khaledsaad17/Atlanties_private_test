const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }), // يجيب stack لو فيه exception
        winston.format.json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        // يسجل كل errors كاملة فى ملف
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // يسجل كل اللوجز كاملة
        new winston.transports.File({ filename: 'combined.log' }),

        // Console → يطبع بس الرسالة
        new winston.transports.Console({
        format: winston.format.printf(({ message }) => {
            return message; // يطبع الرسالة بس
        })
        })
    ],

    // يمسك الـ uncaught exceptions
    exceptionHandlers: [
        new winston.transports.File({ filename: 'exceptions.log' }),
        new winston.transports.Console({
        format: winston.format.printf(({ message }) => {
            return message;
        })
        })
    ],

    // يمسك الـ unhandled promise rejections
    rejectionHandlers: [
        new winston.transports.File({ filename: 'rejections.log' }),
        new winston.transports.Console({
        format: winston.format.printf(({ message }) => {
            return message;
        })
        })
    ]
});

module.exports = logger;
