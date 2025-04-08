// server/routes/canteen.js
const express = require('express');
const router = express.Router();
const canteenController = require('../controllers/canteenController.js');
const authenticate = require('../middleware/authenticate.js');

// router.get('/order-queue', authenticate, canteenController.orderQueue);
// router.post('/accept-order', authenticate, canteenController.acceptOrder);
// router.post('/reject-order', authenticate, canteenController.rejectOrder);
// router.post('/ready-order', authenticate, canteenController.readyOrder);

// router.get('/reservation-queue', authenticate, canteenController.reservationQueue);
// router.post('/accept-reservation',authenticate, canteenController.acceptReservation);
// router.post('/reject-reservation', authenticate, canteenController.rejectReservation);

router.get('/order-queue', canteenController.orderQueue);
router.post('/accept-order', canteenController.acceptOrder);
router.post('/reject-order', canteenController.rejectOrder);
router.post('/ready-order', canteenController.readyOrder);

router.get('/reservation-queue', canteenController.reservationQueue);
router.post('/accept-reservation', canteenController.acceptReservation);
router.post('/reject-reservation', canteenController.rejectReservation);

module.exports = router;