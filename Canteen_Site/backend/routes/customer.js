// // server/routes/customer.js
const express = require('express');
const router = express.Router();
// const authenticateJWT = require('../middleware/authenticate.js');
const customerController = require('../controllers/customerController.js')
const authenticate = require('../middleware/authenticate.js')

// // routing
// router.post('/customer-home-dish-search' , customerController.searchDish) ; 
router.get('/customer-search-canteen' ,authenticate, customerController.searchCanteen ) ;
router.get('/customer-search-dish' ,authenticate, customerController.searchDish ) ; 
router.get('/customer-fetch-reservations' ,authenticate, customerController.fetchReservations );
router.get('/customer-add-dish' , customerController.addDishToCart ) ;
router.get('/customer-view-order-history' ,authenticate, customerController.viewOrderHistory ) ;
router.get('/customer-view-favourites' ,authenticate, customerController.viewFavourites ) ;
router.get('/customer-add-favourite',authenticate, customerController.addFavourites ) ; 
router.get('/customer-wallet',authenticate,customerController.viewWallet ) ;
router.get('/customer-update-wallet' ,authenticate, customerController.updateWallet ) ;
router.get('/customer-add-reservations' ,authenticate, customerController.addReservations ) ;
router.post('/customer-view-profile',authenticate, customerController.viewProfile) ;
router.post('/customer-fetch-top5' ,authenticate, customerController.fetchTop5) ; 
// router.post('/extractUserData' , customerController.extractUserData) ;

module.exports = router;