// server/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/addUser', authController.addUser) ;
// router.post('/customer-otp-verification' , ) ; 
// router.post('/reset-password', authController.resetPassword);
router.post('/add-user', authController.addUser) ;
// router.get('/ping', (req, res) => {
//     res.send('pong');
//   });
  

module.exports = router;
