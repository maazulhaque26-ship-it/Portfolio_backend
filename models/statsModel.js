const mongoose = require('mongoose');

const Statschema = new mongoose.Schema({
    icon: {
        type: String, // Ya Number, jo bhi aapka icon ka data type hai
        required: true 
    },
    clients: {
        type: Number,
        required: true 
    },
    experience: {
        type: Number,
        required: true 
    },
    projects: {
        type: Number,
        required: true 
    },
    achivements: {
        type: Number,
        required: true 
    },
});

module.exports = mongoose.model('Stats', Statschema);