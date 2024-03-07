const express = require('express');
const router = express.Router();

const packageController = require('../../controllers/packageController')



router.route('/')
    .post(packageController.newPackage)
    

module.exports = router;