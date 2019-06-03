const express = require('express');
const bodyParser = require('body-parser');
const mongoose =require('mongoose');

const Post = require('./models/post');

mongoose.connect('mongodb://localhost/first', {useNewUrlParser: true})
.then(()=>{
    console.log('connected to db');
})
.catch(()=>{
    console.log('connection failed');
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req , res , next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With ,Content-Type, Accept");
    res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, PATCH, DELETE,OPTIONS");    
            next();
});


app.post('/api/posts',(req, res, next)=>{
   const post = new Post({
       title:req.body.title,
       content: req.body.content
   });
//    console.log(post);
   post.save().then((createdPost) =>{
    res.status(201).json({
        messsage:'post added',
        postId:createdPost._id
    })
   } );
   
});

app.get('/api/posts',(req, res, next)=>{
    // posts=[
    //         {id:'1',title:'First Post', content:'this is the first post content'},
    //         {id:'2',title:'Second Post', content:'this is the second post content'},
    //         {id:'3',title:'third Post', content:'this is the third post content'},
    //     ];
    Post.find().then(documents => {
        // console.log(documents);
        res.status(200).json({
            messsage:'Posts fetched successfully !',
            posts:documents
        });
    });
 });

 app.get('/api/posts/:id', (req, res ,next)=>{
    Post.findById(req.params.id).then(post => {
        if(post){
            res.status(200).json(post)
        }else{
            res.status(404).json({message: "Post not found"});
        }
    });
 });
 
 app.put('/api/posts/:id', (req,res  , next)=>{
     const post = new Post({
         _id:req.body.id,
        title:req.body.title,
        content: req.body.content
     });

     Post.updateOne({_id:req.params.id },post).then(result =>{
            console.log(result);
            res.status(200).json({messsage:"update successfull"});
     })
 });

    app.delete('/api/posts/:id', (req , res , next)=>{
        // console.log(req.params.id);
        Post.deleteOne({_id:req.params.id}).then((result)=>{
            console.log(result);
        }
        );
        res.status(200).json({messsage:'Post deleted!'});
    });
  


module.exports = app;