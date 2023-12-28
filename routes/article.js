const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const multer = require('multer');

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

router.post('/add',upload.any('image'),(req,res)=>{
    let data = req.body;
    let article  = new Article(data);
    article.date = new Date();
    article.image = fileName;
    article.tags= data.tags.split(',');
    article.save()
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
    Article.find({})
        .then(
            (allArticles)=>{
                res.status(200).send(allArticles);
                console.log(res);
            }
        )
        .catch(
            (error)=>{
                res.status(400).send(error);
                console.error('error on trying to get all article error :: ' + error);
            }
        )
})

router.get('/getbyid/:id',(req,res)=>{
    let articleId= req.params.id;
    Article.findOne({_id : articleId})
        .then(
            (artcile)=>{
                res.status(200).send(artcile);
                console.log(artcile);
            }
        )
        .catch(
            (error)=>{
                res.status(400).send(error);
                console.error("error occure on trying to get one error :: "+error);
            }
        )
})

router.get('/getbyidauthor/:id',(req,res)=>{
    let articleId= req.params.id;
    Article.find({idAuthor : articleId})
        .then(
            (artcile)=>{
                res.status(200).send(artcile);
                console.log(artcile);
            }
        )
        .catch(
            (error)=>{
                res.status(400).send(error);
                console.error("error :: "+error);
            }
        )
})

router.delete('/delete/:id',(req,res)=>{
    let id = req.params.id;
    Article.findByIdAndDelete({_id : id})
        .then(
            (article)=>{
                res.status(200).send(article);
                console.log('deleted : '+article);
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
    data.tags = data.tags.split(',');
    if (fileName.length >0) {
        data.image = fileName;
    }
    
    Article.findByIdAndUpdate({_id : id}, data)
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