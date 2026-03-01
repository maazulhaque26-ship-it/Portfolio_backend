const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    linkTitle: { type: String, default: 'CONNECT WITH ME' },
    linkUrl: { type: String, default: 'https://wa.me/yournumber' }
});

module.exports = mongoose.model('Contact', contactSchema);