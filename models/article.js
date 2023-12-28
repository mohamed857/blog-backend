const mongoose= require('mongoose');
const article= mongoose.model('article',{
    title: String,
    idAuthor: String,
    description: String,
    date: String,
    content: String,
    image: String,
    tags: Array
})


module.exports = article;