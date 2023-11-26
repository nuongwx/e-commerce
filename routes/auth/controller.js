const express = require('express');
const authService = require('./service');


/* GET home page. */
exports.getLogin = function (req, res, next) {
    res.render('auth/login', {title: 'Login', layout: 'auth/layout'});
}

exports.postLogin = function (req, res, next) {
    authService.login(req, res, next);
}

exports.logout = function (req, res, next) {
    authService.logout(req, res, next);
}

exports.getRegister = function (req, res, next) {
    res.render('auth/register', {title: 'Register', layout: 'auth/layout'});
}

exports.register = function (req, res, next) {
    console.log(req.body);
    authService.register(req, res, next);
}
