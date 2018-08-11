const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the Domain schema
const DomainSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    domain: {
        type: String,
        required: true
    },
    date_reg: {
        type: Date,
        required: true,
    },
    date_exp: {
        type: Date,
        required: true
    },
    provider: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('domain', DomainSchema);