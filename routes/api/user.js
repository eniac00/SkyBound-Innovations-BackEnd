const express = require('express');
const router = express.Router();
const detailsController = require('../../controllers/user/detailsController');
const packageController = require('../../controllers/user/packageController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const flightController = require('../../controllers/user/flightController');


router.route('/')
    .get(verifyRoles(ROLES_LIST.User), detailsController.getDetails)
    .put(verifyRoles(ROLES_LIST.User), detailsController.updateDetails);

router.route('/package')
    .get(verifyRoles(ROLES_LIST.User), packageController.getAllPackages);

router.route('/flight')
// because use will send the selected airlines,fron,to fron the frontend to the back.
    .post(verifyRoles(ROLES_LIST.User), flightController.getFlights);

router.route('/package/:id')
    .get(verifyRoles(ROLES_LIST.User), packageController.getSinglePackage);

module.exports = router;

