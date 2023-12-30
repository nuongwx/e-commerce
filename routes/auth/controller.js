// const express = require('express');
const authService = require('./service');


/* GET home page. */
exports.getLogin = function (req, res, next) {
    console.log(JSON.stringify(res.locals));
    console.log(JSON.stringify(req.session));
    if (req.user) {
        return res.redirect('/');
    }
    res.render('auth/index', { title: 'Login', layout: 'auth/layout', login: true });
}

// exports.postLogin = function (req, res, next) {
//     authService.login(req, res, next);
// }

exports.logout = function (req, res, next) {
    // authService.logout(req, res, next);
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    });
    req.session.messages = 'You have been logged out';
    res.redirect('/');
}

exports.getRegister = function (req, res, next) {
    res.render('auth/index', { title: 'Register', layout: 'auth/layout', register: true });
}

exports.register = async function (req, res, next) {
    console.log(req.body);
    authService.register(req, res, next);
}

exports.verifyEmail = async function (req, res, next) {
    authService.verifyEmail(req, res, next);
}

exports.forgotPassword = async function (req, res, next) {
    authService.forgotPassword(req, res, next);
}

exports.resetPassword = async function (req, res, next) {
    authService.resetPassword(req, res, next);
}