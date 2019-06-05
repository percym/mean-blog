const express = require('express');

const router = express.Router();
const Post = require('../models/post');
const multer = require('multer');
const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
};

const storage = multer.diskStorage({
    destination:(req, file , cb)=>{
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("invalid image mime type");
        if(isValid){
            error = null;
        }
        cb(error,"backend/images");
    },
    filename:(req, file ,cb)=>{
        const name= file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-'+Date.now()+ '.' + ext);

    }
});

router.post('',multer({storage:storage}).single("image"),(req, res, next)=>{
    const url =req.protocol + '://' +req.get('host');
    const post = new Post({
        title:req.body.title,
        content: req.body.content,
        imagePath:url + "/images/" +req.file.filename
    });
 //    console.log(post);
    post.save().then((createdPost) =>{
     res.status(201).json({
         messsage:'post added',
         post:{
            ...createdPost,
             id:createdPost._id,
            //  title:createdPost.title,
            //  content:createdPost.content,
            //  imagepath:createdPost.imagePath

         }
     })
    } );
    
 });
 
 router.get('',(req, res, next)=>{
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
 
  router.get('/:id', (req, res ,next)=>{
     Post.findById(req.params.id).then(post => {
         if(post){
             res.status(200).json(post)
         }else{
             res.status(404).json({message: "Post not found"});
         }
     });
  });
  
  router.put('/:id', (req,res  , next)=>{
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
 
  router.delete('/:id', (req , res , next)=>{
         // console.log(req.params.id);
         Post.deleteOne({_id:req.params.id}).then((result)=>{
             console.log(result);
         }
         );
         res.status(200).json({messsage:'Post deleted!'});
     });
   
     module.exports = router;