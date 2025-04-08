const express = require('express');
const router = express.Router();
const razorpayController = require('../controllers/razorpayController.js');

// router.post("manage-payment" , razorpayController.managePayment) ; 
router.post('/' ,express.raw({ type: "application/json" }), razorpayController.managePayment) ;

module.exports = router;