const express = require('express');
const router = express.Router();
const detailsController = require('../../controllers/user/detailsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');


router.route('/')
    .get(verifyRoles(ROLES_LIST.User), detailsController.getDetails)
    .put(verifyRoles(ROLES_LIST.User), detailsController.updateDetails);

module.exports = router;

