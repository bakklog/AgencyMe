const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the Profile schema
const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    handle: {
        type: String,
        required: true,
        max: 40
    },
    company: {
        type: String
    },
    position: {
        type: String,
        default: 'Employee'
    },
    githubusername: {
        type: String
    },
    skills: {
        type: [String]
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);