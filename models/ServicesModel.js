const mongoose = require ('mongoose')

const Serviceschema = new mongoose.Schema({
    icon:{
        type: String,
        required: true 
    },
    title:{
        type: String,
        required: true 
    },
    discription:{
        type: String,
        required: true 
    },
    
})

module.exports = mongoose.model('Services', Serviceschema);