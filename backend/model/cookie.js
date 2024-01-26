const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cookieSchema = new Schema ({
    name: String,
    domain: String,
    expirationDate: Date,
    identifier: String,
    category: String,
    blockedStatus: {
        type: Boolean,
        default: false
    }
})

const Cookie = mongoose.model('Cookie', cookieSchema);

module.exports = Cookie;