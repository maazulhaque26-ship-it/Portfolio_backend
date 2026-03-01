const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
    greeting: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true }
});

module.exports = mongoose.model('Hero', heroSchema);