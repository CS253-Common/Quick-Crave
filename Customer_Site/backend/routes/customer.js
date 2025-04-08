// // server/routes/customer.js
const express = require('express');
const router = express.Router();
// const authenticateJWT = require('../middleware/authenticate.js');
const customerController = require('../controllers/customerController.js')
const authenticate = require('../middleware/authenticate.js')

// // routing
// router.post('/customer-home-dish-search' , customerController.searchDish) ; 
router.post('/customer-search-canteen' ,authenticate,customerController.searchCanteen ) ; // done
router.post('/customer-search-dish' ,authenticate, customerController.searchDish ) ; // done
router.post('/customer-fetch-reservations' ,authenticate, customerController.fetchReservations ); // done 
router.post('/customer-add-dish' ,authenticate, customerController.addDishToCart ) ; // done 
router.post('/customer-remove-dish' ,authenticate, customerController.removeDishFromCart ) ; // done
router.post('/customer-view-order-history' ,authenticate,customerController.viewOrderHistory ) ; // done
router.post('/customer-view-favourites' , authenticate, customerController.viewFavourites ) ; // done 
router.post('/customer-remove-favourite' , authenticate, customerController.removeFavourites ) ; // done 
router.post('/customer-add-favourite',authenticate, customerController.addFavourites ) ; // done 
router.post('/customer-wallet', authenticate,customerController.viewWallet ) ; // done
router.post('/customer-update-wallet' ,authenticate, customerController.updateWallet ) ; // done 
router.post('/customer-add-reservations' ,authenticate, customerController.addReservations ) ; // done 
router.post('/customer-view-profile',authenticate,customerController.viewProfile) ; // done 
router.post('/customer-fetch-top5', authenticate , customerController.fetchTop5) ; // done 
router.post('/customer-reset-password',authenticate, customerController.resetPassword); 
router.post('/customer-update-profilephoto', authenticate , customerController.updateProfilePhoto) ; // done
router.post('/customer-update-profile' ,authenticate, customerController.updateProfile) ;  // done 
router.post('/customer-change-password' ,authenticate,  customerController.changePassword) ; // done
router.post('/customer-fetch-dishes' ,authenticate, customerController.fetchDishes) ; // done 
router.post('/customer-fetch-canteens' ,authenticate,customerController.fetchCanteens) ; // done
router.post('/customer-fetch-menu' ,authenticate, customerController.fetchMenu) ; // done 
router.post('/customer-view-cart' ,authenticate, customerController.viewCart) ;  // done 
router.post('/request-order',authenticate, customerController.requestOrder) ;
router.post('/place-order' ,authenticate, customerController.placeOrder) ; 
router.post('/fetch-transactions', authenticate, customerController.fetchTransactions) ;
router.post('/set-order-type' , authenticate, customerController.setOrderType) ; 
// router.post('/extractUserData' , customerController.extractUserData) ; 

module.exports = router;

// request order ->  1 
// accepted - 2 
// Payment - 3 
//  - 4

