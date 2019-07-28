const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// USERS LOGIN ROUTE
router.get('/login', (req, res) => {
    res.render('users/login');
});

// USERS REGISTER ROUTE
router.get('/register', (req, res) => {
    res.render('users/register');
});

// REGISTER FORM POST
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({text: 'Please all required fields must be filled'});
    }

    if (password !== password2) {
        errors.push({text: 'Passwords do not match'});
    }

    if (password.length < 4) {
        errors.push({text: 'Password must be at least 4 characters'});
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors,
            name,
            password,
            password2
        });
    } else {
        User.findOne({email: email})
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'Email already registered');
                    res.redirect('/users/register');
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    })
            
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
            
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You\'re now registered and can log in');
                                    res.redirect('/users/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                });
                        });
                    });
                }
            });
    }
});

// LOGIN FORM POST
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// USERS LOGOUT ROUTE
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You\'re now logged out');
    res.redirect('/users/login');
});









module.exports = router;