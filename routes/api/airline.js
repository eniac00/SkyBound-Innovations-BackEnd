const express = require('express');
const router = express.Router();
const detailsController = require('../../controllers/airline/detailsController');
const packageController = require('../../controllers/airline/packageController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const flightController = require('../../controllers/airline/flightController');



router.route('/')
    .get(verifyRoles(ROLES_LIST.Airline), detailsController.getDetails)
    .put(verifyRoles(ROLES_LIST.Airline), detailsController.updateDetails);

router.route('/package')
    .get(verifyRoles(ROLES_LIST.Airline), packageController.getPackages)
    .post(verifyRoles(ROLES_LIST.Airline), packageController.createPackage)
    .put(verifyRoles(ROLES_LIST.Airline), packageController.updatePackage)
    .delete(verifyRoles(ROLES_LIST.Airline), packageController.deletePackage);

router.route('/flight')
    .post(verifyRoles(ROLES_LIST.Airline), flightController.createFlight)
    .get(verifyRoles(ROLES_LIST.Airline), flightController.getFlights)
    .delete(verifyRoles(ROLES_LIST.Airline), flightController.deleteFlight);


module.exports = router;
