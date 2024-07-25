var express = require('express');
var router = express.Router();
var db = require('../../db_con/conn');
var Category = require('../../models/category');

router.get('/:restaurant_id/:category_id?',async(req, res)=>{
    try{
        const restaurantId= req.params.restaurant_id;
        const categoryId = req.params.category_id;
        let search_query={ restaurant_id : restaurantId };

        if(req.params.category_id){
            search_query._id = categoryId;
            }
        console.log(search_query);

        let categorys = await Category.find(search_query);

        console.log(categorys);
        
        res.json(categorys);
        }catch(err){
        res.status(500).json({message: err.message});
    }

});

router.post('/update', async()=>{
    try{
        const categoryid = req.body.restaurant_id;
        const original = await Category.findById(categoryid);

        const category = {
            name:req.body.name || original.name,
            restaurant_id: req.body.restaurant_id || original.restaurant_id,
            restaurant_name: req.body.restaurant_name || original.restaurant_name
        }

        const updatedcategory = await Category.findByIdAndUpdate(categoryid, category, {new: true});

        res.json(updatedcategory);

    }catch(err){
        res.status(500).json({message: err.message});
    }
});

router.get('/:restaurant_id/:category_id',async(req,res)=>{
    try{

        const restaurantid = req.params.restaurant_id;
        const categoryid = req.params.category_id;

        const search_query = {
            restaurant_id: restaurantid,
            _id: categoryid
        }

        const delcategory = await Category.deleteOne(search_query);

        res.json(delcategory);

    }catch(err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;