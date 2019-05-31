const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req , res , next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Access-Control-Allow-Header",
        "Origin,X-Requested-With ,Content-Type, Accept");
    res.setHeader(
            "Access-Control-Allow-Method",
            "GET, POST, PATCH, DELETE,OPTIONS");    
            next();
});

app.post('/api/posts',(req, res, next)=>{
   const post = req.body;
   console.log(post);
   res.status(201).json({
       messsage:'post added'
   })
});
app.get('/api/posts',(req, res, next)=>{
    posts=[
            {id:'1',title:'First Post', content:'this is the first post content'},
            {id:'2',title:'Second Post', content:'this is the second post content'},
            {id:'3',title:'third Post', content:'this is the third post content'},
        ];
    res.status(200).json({
        messsage:'Posts fetched successfully !',
        posts:posts
    });
});

module.exports = app;