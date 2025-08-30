const express = require('express')
const cors = require('cors');
const login_route = require('../routers/login');
const register_route = require('../routers/register');


module.exports = function (app) {
    app.use(express.urlencoded({extended:true}))
    app.use(express.json());
    app.use('/login',login_route)
    app.use('/register',register_route)
    app.use(cors())
}
