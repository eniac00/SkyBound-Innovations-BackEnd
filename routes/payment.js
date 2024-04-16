const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');


router.route('/')
    .post(paymentController.doPayment);

router.route('/success/:tran_id')
    .post(paymentController.success);

module.exports = router;