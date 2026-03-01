const mongoose = require('mongoose');

const dbURI = process.env.MONGO_URI; 

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log('Connection Error:', err));