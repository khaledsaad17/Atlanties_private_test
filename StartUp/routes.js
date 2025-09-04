const express = require('express')
const cors = require('cors');
const login_route = require('../routers/login');
const register_route = require('../routers/register');
const forget_password = require('../routers/forget_password');
const feedback_route = require('../routers/feedback');

module.exports = function (app) {
    app.use(cors());
    app.use(express.urlencoded({extended:true}));
    app.use(express.json());
    app.use('/login',login_route);
    app.use('/register',register_route);
    app.use('/reset-password',forget_password);
    app.use('/feedback',feedback_route);
}
