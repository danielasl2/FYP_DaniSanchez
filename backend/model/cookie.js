const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cookieSchema = new Schema({
    name: String,
    domain: String,
    expirationDate: {
        type: Date,
        default: null 
    },
    secure: {
        type: Boolean,
        default: false
    },
    session: {
        type: Boolean,
        default: false 
    },
    identifier: String,
    category: String,
    blockedStatus: {
        type: Boolean,
        default: false
    }
});

const Cookie = mongoose.model('Cookie', cookieSchema);
module.exports = Cookie;
