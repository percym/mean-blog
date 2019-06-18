const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose =require('mongoose');



const postroutes = require('./routes/posts');
const userroutes = require('./routes/user');

mongoose.connect('mongodb://localhost/first', {useNewUrlParser: true})
.then(()=>{
    console.log('connected to db');
})
.catch(()=>{
    console.log('connection failed');
});

const app = express();

const expressSwagger = require('express-swagger-generator')(app);
const swaggerOptions = require('./swagger');
expressSwagger(swaggerOptions);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use('/images', express.static(path.join('backend/images')));

app.use((req , res , next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With ,Content-Type, Accept,Authorization");
    res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, PATCH, DELETE,OPTIONS");    
            next();
});

app.use('/api/posts',postroutes);
app.use('/api/user',userroutes);
module.exports = app;