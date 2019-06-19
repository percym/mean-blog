const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

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


router.post('',checkAuth, multer({storage:storage}).single("image"),(req, res, next)=>{
    const url =req.protocol + '://' +req.get('host');
    const post = new Post({
        title:req.body.title,
        content:   req.body.content,
        imagePath:url + "/images/" +req.file.filename,
        creator: req.userData.userId
    });
 //    console.log(post);
    post.save().then((createdPost) =>{
     res.status(201).json({
         messsage:'post added',
         post:{
            ...createdPost,
             id:createdPost._id,
         }
     });
    });
    
 });
 
 router.get('',(req, res, next)=>{
     const pageSize = +req.query.pageSize;
     const currentPage = +req.query.page;
     const postQuery = Post.find();
     let fetchedPosts;

     if(pageSize && currentPage){
        postQuery
        .skip(pageSize * (currentPage -1))
        .limit(pageSize);
     }
     postQuery.then(documents => {
         fetchedPosts = documents;
        return Post.countDocuments();
     }).then(count =>{
        res.status(200).json({
            messsage:'Posts fetched successfully !',
            posts:fetchedPosts,
            maxPosts:count
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
  
  router.put('/:id', checkAuth ,(req,res  , next)=>{
      const post = new Post({
          _id:req.body.id,
         title:req.body.title,
         content: req.body.content
      });
      
      Post.updateOne({_id:req.params.id,creator:req.userData.userId },post).then(result =>{
             console.log(result);
             if(result.nmodified>0){
                return res.status(200).json({messsage:"update successfull"});
            }else{
                return res.status(401).json({messsage:"unauthorised "});
            }
      })
  });

  router.delete('/:id', checkAuth ,(req , res , next)=>{
         // console.log(req.params.id);
         Post.deleteOne({_id:req.params.id, creator:req.userData.userId}).then((result)=>{
             console.log(result);
             if(result.n>0){
                return res.status(200).json({messsage:"deletion successfull"});
            }else{
                return res.status(401).json({messsage:"unauthorised "});
            }
             
            }
         );
         res.status(200).json({messsage:'Post deleted!'});
     });
   
     module.exports = router;