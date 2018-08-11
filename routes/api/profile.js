const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load in validators
const validateProfileInput = require('../../validation/profile');

// Load profile model
const Profile = require('../../models/Profile');
// Load user model
const User = require('../../models/User');

/**
 * @route GET api/profile/test
 * @desc Test profile route
 * @access Public
 */
router.get('/test', (req, res) => res.json({
    msg: "Profile works"
}));

/**
 * @route   GET api/profile/
 * @desc    Shows current user profile if they have one
 * @access  Private
 */
router.get('/', passport.authenticate('jwt', { session: false }), (req,res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
        if (!profile) {
            errors.noprofile = 'There is no profile for this user';
            return res.status(404).json(errors);
        }
        res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

/**
 * @route   POST api/profile
 * @desc    Create or Edit a user profile
 * @access  Private
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check validation
    if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    // TODO: Default ID as handle when no specified
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.position) profileFields.position = req.body.position;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    // Skills (split into an array)
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
        if (profile) {
            // Update
            Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true }).then(profile => res.json(profile));
        } else {
            // Create

            // Check if the handle exists
            Profile.findOne({ handle: profileFields.handle }).then(profile => {
                if(profile) {
                    errors.handle = 'That handle already exists';
                    res.status(400).json(errors);
                }

                // Save profile
                new Profile(profileFields).save().then(profile => res.json(profile));
            });
        }
    });
});

/**
 * @route   DELETE api/profile
 * @desc    Delete user and profile
 * @access  Private
 */
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
        User.findOneAndRemove({ _id: req.user.id }).then(() => {
            res.json({ success: true })
        });
    });
});

module.exports = router
