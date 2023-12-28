const mongoose = require('mongoose');
const author = mongoose.model('author', {
    name: String,
    lastName: String,
    email: { type: String, unique: true},
    password: String,
    about: String,
    image: String
})

module.exports= author;