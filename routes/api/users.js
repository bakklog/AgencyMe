const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const mjmltohtml = require('mjml');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

// Sendgrid authentication
const sgAuth = {
    auth: {
        api_user: 'process.env.SENDGRID_USERNAME',
        api_key: 'process.env.SENDGRID_PASSWORD'
    }
}
const sgMailer = nodemailer.createTransport(sgTransport(sgAuth));



// sgMailer.sendMail(email, function(err, info) {
    // if (err) {
        // console.log(errors);
    // }
    // else {
        // console.log('Message sent: ' + info.response);
    // }
// });

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const user = require('../../models/User');

/**
 * @route GET api/users/test
 * @desc Test user route
 * @access Public
 */
router.get('/test', (req, res) => res.json({
    msg: "Users works"
}));

/**
 * @route   GET api/register/test
 * @desc    Register a user
 * @access  Public
 */
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    
    // Check validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            errors.email = 'An unknown error has occurred. Please try again.'
            return res.status(400).json(errors);
        } else {
            
            const avatar = gravatar.url(req.body.email, {
                s: '200', // Size
                r: 'pg', // Rating 
                d: 'mm' // Default
            }, true);

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

/**
 * @route   POST api/login
 * @desc    Login a user and return JWT
 * @access  Public
 */
router.post('/login', (req,res) =>{
    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password

    // Find user by email
    User.findOne({ email }).then(user => {
        // Check for user
        if (!user) {
            errors.email = 'The email or password is incorrect. Please try again.';
            return res.status(404).json(errors);
        }

        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // user matched

                const payload = { id: user.id, name: user.name, avatar: user.avatar } // Create JWT payload

                // Sign token
                jwt.sign(payload, process.env.SECRET, { expiresIn: 604800 }, (err, token) => {
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                    });
                });
            } else {
                errors.password = 'The email or password is incorrect. Please try again.';
                res.status(400).json(errors);
            }
        });
    });
});

/**
 * @route   POST api/users/reset/:token
 * @desc    Process the reset password request
 * @access  Public
 */
router.post('/')

/**
 * @route   GET api/users/current
 * @desc    Return current user
 * @access  Private
 */
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
    });
});

module.exports = router;