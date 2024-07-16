var express =require('express');
var router = express.Router();
var db = require('../../db_con/conn');
var Bill = require('../../models/bill');

router.get('/', async(req, res)=>{
    try{

        var variable_name = res.body.variable_name;
        var value = res.body.value;

        const search_query={};
        for(const [key, value] of Object.entries(body)){
            if(key==='restaurant_id'){
              search_query[key]=value;
            }else{
              search_query[key]={ $regex: new RegExp(value, 'i') };
            }
          }

        const bills= await bill.find(search_query);

        res.json(bills);

    }catch(err){

    }
});

router.post('/upload', async(req, res)=>{
    try{
        const newbill = new Bill({
            item_list: req.body.item_list,
            total: req.body.total,
            discount: req.body.dis,
            bill_channel: req.body.channel,
            bill_status: req.body.status,
            restauurant_id: req.body.restaurant_id,
            restaurant_name: req.body.restaurant_name
        });
        const savedbill = await newbill.save();
        res.json(savebill);
    }catch(err){
        res.status(500).json({message: res.message});
    }
});

module.exports = router;