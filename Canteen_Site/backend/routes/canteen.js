// server/routes/canteen.js
const express = require('express');
const router = express.Router();
const canteenController = require('../controllers/canteenController.js');
const authenticate = require('../middleware/authenticate.js');

// router.post('/order-queue',   canteenController.orderQueue);
// router.post('/accept-order',  canteenController.acceptOrder);
// router.post('/reject-order',  canteenController.rejectOrder);
// router.post('/ready-order',  canteenController.readyOrder);

// router.post('/reservation-queue',  canteenController.reservationQueue);
// router.post('/accept-reservation',  canteenController.acceptReservation);
// router.post('/reject-reservation',  canteenController.rejectReservation);

// router.post('/active-discounts',  canteenController.getActiveDiscounts);
// router.post('/active-coupons',  canteenController.getActiveCoupons);
// router.post('/delete-discount',  canteenController.deleteDiscount);
// router.post('/delete-coupon',  canteenController.deleteCoupon);
// router.post('/create-discounts',  canteenController.createDiscounts);
// router.post('/create-coupon',  canteenController.createCoupon);

// router.post('/menu-items',  canteenController.getMenuItems);

// router.post('/trending-picks',  canteenController.getTrendingPicks);
// router.post('/home-order-queue',  canteenController.getHomeOrderQueue);
// router.post('/home-reservation-queue',  canteenController.getHomeReservationQueue);
// router.post('/home-discount-n-coupons',  canteenController.getHomeDiscountNCoupons);

// router.post('/profile', canteenController.getProfileInfo);
// router.post('/edit-profile', canteenController.editProfileInfo);
// router.post('/edit-password', canteenController.editPassword);


// router.post('/edit-dish', canteenController.editDish);
// router.post('/add-dish', canteenController.addDish);

// router.post('/get-statistics',  canteenController.getStatistics);
// router.post('/get-graphs',  canteenController.getGraphs);

router.post('/order-queue', authenticate, canteenController.orderQueue);
router.post('/accept-order', authenticate, canteenController.acceptOrder);
router.post('/reject-order', authenticate, canteenController.rejectOrder);
router.post('/ready-order', authenticate, canteenController.readyOrder);

router.post('/reservation-queue', authenticate, canteenController.reservationQueue);
router.post('/accept-reservation', authenticate, canteenController.acceptReservation);
router.post('/reject-reservation', authenticate, canteenController.rejectReservation);

router.post('/active-discounts', authenticate, canteenController.getActiveDiscounts);
router.post('/active-coupons', authenticate, canteenController.getActiveCoupons);
router.post('/delete-discount', authenticate, canteenController.deleteDiscount);
router.post('/delete-coupon', authenticate, canteenController.deleteCoupon);
router.post('/create-discounts', authenticate, canteenController.createDiscounts);
router.post('/create-coupon', authenticate, canteenController.createCoupon);

router.post('/menu-items', authenticate, canteenController.getMenuItems);

router.post('/trending-picks', authenticate, canteenController.getTrendingPicks);
router.post('/home-order-queue',authenticate, canteenController.getHomeOrderQueue);
router.post('/home-reservation-queue', authenticate, canteenController.getHomeReservationQueue);
router.post('/home-discount-n-coupons', authenticate, canteenController.getHomeDiscountNCoupons);

router.post('/profile', authenticate, canteenController.getProfileInfo);
router.post('/edit-profile', authenticate, canteenController.editProfileInfo);
router.post('/edit-password', authenticate, canteenController.editPassword);


router.post('/edit-dish', authenticate, canteenController.editDish);
router.post('/add-dish', authenticate, canteenController.addDish);
router.post('/delete-dish', authenticate, canteenController.deleteDish);

router.post('/get-statistics', authenticate, canteenController.getStatistics);
router.post('/get-graphs', authenticate, canteenController.getGraphs);


module.exports = router;