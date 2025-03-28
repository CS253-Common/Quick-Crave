// server/routes/canteen.js
const express = require('express');
const router = express.Router();
const canteenController = require('../controllers/canteenController.js');
const authenticate = require('../middleware/authenticate.js');

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
router.post('/home-order-queue', authenticate, canteenController.getHomeOrderQueue);
router.post('/home-reservation-queue', authenticate, canteenController.getHomeReservationQueue);
router.post('/home-discount-n-coupons', authenticate, canteenController.getHomeDiscountNCoupons);

router.post('/profile-info',authenticate, canteenController.getProfileInfo);
router.post('/edit-profile-info',authenticate, canteenController.editProfileInfo);
router.post('/edit-password',authenticate, canteenController.editPassword);


// router.post('/edit-dish',authenticate, canteenController.editDish);
// router.post('/add-dish',authenticate, canteenController.addDish);


module.exports = router;