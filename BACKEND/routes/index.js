var express = require('express');
var stripe = require('stripe')(process.env.stripeApiKey);
var dotenv = require('dotenv')
var router = express.Router();
var path = require("path");


dotenv.config();


// SRTIPE GATEWAY
let strip_payment_gateway = stripe(process.env.stripeApiKey);
let siteDomain = process.env.siteDomain


// GET Home page
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'PUBLIC', 'index.html'));
});

// GET Success page
router.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'PUBLIC', 'success.html'));
});

// GET Failed page
router.get('/cancel', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'PUBLIC', 'cancel.html'));
});


router.post('/checkout', async(req, res)=>{
  const lineItems = req.body.items.map((item) =>{
    const amount = parseInt(item.price.replace(/[^0-9.-]+/g, '')*100);
    console.log("Price item:", item.price);
    console.log("Amount:", amount);
    return{
      price_data :{
        currency: 'usd',
        product_data: {
          name : item.title,
          images : [item.productimage]
        },
        unit_amount : amount,
      },
      quantity : item.quantity,
    }
  });
  console.log("line-items:", lineItems);


  // CREATING CHECKOUT SESSION
  const session = await strip_payment_gateway.checkout.sessions.create({
    payment_method_types : ['card'],
    mode : 'payment',
    success_url : `${siteDomain}/success`,
    cancel_url : `${siteDomain}/cancel`,
    line_items : lineItems,
    // Adding billing address
    billing_address_collection : "required",
  });
  res.json(session.url);
});

module.exports = router;
