const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/test')
    .then(
        ()=>{
            console.log('connected to DataBase test');
        }
    )
    .catch(
        (err)=>{
            console.error('error when trying to connect to DataBase :: '+err);
        }
    )

module.exports=mongoose;
