var express = require('express');
var mongoose =require('mongoose');
var router = express.Router();
var db = require('../../db_con//conn');
var image = require('../../models/image');
var upload = require('../../middleware/upload');

// router.get('/:restaurant_id/:',async(req, res)=>{



// });

router.post('/upload',upload.single('image'),async(req, res)=>{
    try{
        if(!req.file){
            return res.status(400).json({message: 'please upload an image'});
        }
        const newimage= new image({
            image_name: req.file.filename,
            image_category: req.body.image_category,
            image_category_id: req.body.image_category_id,
            image_category_type: req.body.image_category_type
        });
        const savedimage = await newimage.save();
        res.status(201).json(savedimage);
    }catch(err){
        res.status(201).json({message: err.message});
    }

});

module.exports = router;