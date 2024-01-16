const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cookieSchema = new Schema ({
    name: String,
    domain: String,
    expirationDate: Date,
    category: [String],
    blockedStatus: Boolean
})

const Cookie = mongoose.model('Cookie', cookieSchema);

module.exports = Cookie;