const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const multer = require('multer');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

fileName='';
const mystorage =multer.diskStorage({
    destination: './uploads',
    filename: (req,file,redirect)=>{
        let date =Date.now();
        let f1 = date + '.' + file.mimetype.split('/')[1];
        redirect(null,f1);
        fileName=f1;
    }

})

const upload= multer({storage: mystorage});

router.post('/register',upload.any('image'),(req,res)=>{
    let data = req.body;
    let author  = new Author(data);
    author.date = new Date();
    author.image = fileName;
    let salt = bcrypt.genSaltSync(10);
    author.password = bcrypt.hashSync(data.password,salt);
    author.save()
        .then(
            (saved)=>{
                fileName='';
                res.status(200).send(saved);
                console.log('added successfully');
            }
        )
        .catch(
            (error)=>{
                res.status(400).send(error);
                console.error('error ocure during reqister error :: ');
            }
        )
})


router.post('/login',(req,res)=>{
    let data = req.body;
    Author.findOne({email: data.email})
        .then(
            (author)=>{
                let validpass = bcrypt.compareSync(data.password,author.password);
                if (validpass) {
                    let payload={
                        _id: author._id,
                        email: author.email,
                        fullname: author.name + ' ' + author.lastName
                    }
                    let token = jwt.sign(payload,'10905270');
                    res.status(200).send({mytoken:token});
                    console.log('login successfylly');
                    
                } else {
                    res.status(401).send('invalid email or password');
                    console.error('invalid email or password');
                }
            }
        )
        .catch(
            (error)=>{
                res.status(401).send('invalid email or password');
                console.error('invalid email or password');
            }
        )
        

})


router.post('/add',upload.any('image'),(req,res)=>{
    let data = req.body;
    let author  = new Author(data);
    author.date = new Date();
    author.image = fileName;
    author.save()
        .then(
            (saved)=>{
                fileName='';
                res.status(200).send(saved);
                console.log('added successfully');
            }
        )
        .catch(
            (error)=>{
                res.status(400).send(error);
                console.error('error ocure during add error :: ');
            }
        )
})

router.get('/all',(req,res)=>{
    Author.find({})
        .then(
            (allAuthor)=>{
                res.status(200).send(allAuthor);
                console.log(res);
            }
        )
        .catch(
            (error)=>{
                res.status(400).send(error);
                console.error('error on trying to get all author error :: ' + error);
            }
        )
})

router.get('/getbyid/:id',(req,res)=>{
    let authorId= req.params.id;
    Author.findOne({_id : authorId})
        .then(
            (author)=>{
                res.status(200).send(author);
                console.log(author);
            }
        )
        .catch(
            (error)=>{
                res.status(400).send(error);
                console.error("error occure on trying to get one error :: "+error);
            }
        )
})

// router.get('/getbyidauthor/:id',(req,res)=>{
//     let authorId= req.params.id;
//     Author.find({idAuthor : authorId})
//         .then(
//             (artcile)=>{
//                 res.status(200).send(artcile);
//                 console.log(artcile);
//             }
//         )
//         .catch(
//             (error)=>{
//                 res.status(400).send(error);
//                 console.error("error :: "+error);
//             }
//         )
// })

router.delete('/delete/:id',(req,res)=>{
    let id = req.params.id;
    Author.findByIdAndDelete({_id : id})
        .then(
            (author)=>{
                res.status(200).send(author);
                console.log('deleted : '+author);
            }
        )
        .catch(
            (error)=>{
                res.status(400).send(error);
                console.error('error on deleting error :: '+error);
            }
        )
})

router.put('/update/:id', upload.any('image'),(req,res)=>{
    let id = req.params.id;
    let data = req.body;
    // data.tags = data.tags.split(',');
    if (fileName.length >0) {
        data.image = fileName;
    }
    
    Author.findByIdAndUpdate({_id : id}, data)
    .then(
        (update)=>{
            fileName='';
            res.status(200).send(update);
            console.log('iupdated  : '+update);
        }
    )
    .catch(
        (error)=>{
            res.status(400).send(error);
            console.error('error on updating error :: '+error);
        }
    )
})

module.exports = router;