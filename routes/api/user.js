const express = require('express');
const router = express.Router();
const detailsController = require('../../controllers/user/detailsController');
const packageController = require('../../controllers/user/packageController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');


router.route('/')
    .get(verifyRoles(ROLES_LIST.User), detailsController.getDetails)
    .put(verifyRoles(ROLES_LIST.User), detailsController.updateDetails);

router.route('/package')
    .get(verifyRoles(ROLES_LIST.User), packageController.getAllPackages);

router.route('/package/:id')
    // .get(verifyRoles(ROLES_LIST.User), packageController.);

module.exports = router;

