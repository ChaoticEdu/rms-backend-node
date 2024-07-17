var express =require('express');
var router = express.Router();
var multer = require('multer');
var db= require('../db_con/conn');
var path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename:function(req, file, cb){
        console.log(path.extname(file.originalname));
        cb(null, Date.now()+path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 *1024},
    fileFilter: function(req, file, cb){
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        console.log(extname);
        if(mimetype && extname){
            return cb(null, true);
        }else{
            cb('Error: Images Only!');
        }
    }

});

module.exports = upload;