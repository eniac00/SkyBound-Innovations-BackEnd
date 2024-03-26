const express = require('express');
const router = express.Router();
const detailsController = require('../../controllers/airline/detailsController');
const packageController = require('../../controllers/airline/packageController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');


router.route('/')
    .get(verifyRoles(ROLES_LIST.Airline), detailsController.getDetails)
    .put(verifyRoles(ROLES_LIST.Airline), detailsController.updateDetails);

router.route('/package')
    .get(verifyRoles(ROLES_LIST.Airline), packageController.getPackages)
    .post(verifyRoles(ROLES_LIST.Airline), packageController.createPackage)
    .put(verifyRoles(ROLES_LIST.Airline), packageController.updatePackage)
    .delete(verifyRoles(ROLES_LIST.Airline), packageController.deletePackage);

module.exports = router;
