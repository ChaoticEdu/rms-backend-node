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
            search_query.category_id = categoryId;
            }
        console.log(search_query);

        let categorys = await Category.find(search_query);

        console.log(categorys);
        
        res.json(categorys);
        }catch(err){
        res.status(500).json({message: err.message});
    }

});

module.exports = router;