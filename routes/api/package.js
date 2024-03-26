const express = require('express');
const router = express.Router();

const packageController = require('../../controllers/packageController')



router.route('/')
    .post(packageController.newPackage)
    .get(packageController.getAllPackages)
    

module.exports = router;