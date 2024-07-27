var express = require('express');
var router = express.Router();
var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/',async(req, res)=>{
    const {amount , currency , orderId , userId} = req.body;
    try{

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            metadata :{
                orderId,
                userId
            }
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret
        });
    
    }catch(err){
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = router;