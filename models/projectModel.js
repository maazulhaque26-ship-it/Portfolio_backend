const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    vercelUrl: { 
        type: String, 
        default: 'https://portfolio-maazulhaque.vercel.app/' 
    }
});

module.exports = mongoose.model('Project', projectSchema);