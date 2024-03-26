const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/admin/usersController');
const airlinesController = require('../../controllers/admin/airlinesController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');


router.route('/users')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
    .post(verifyRoles(ROLES_LIST.Admin), usersController.createNewUser)
    .put(verifyRoles(ROLES_LIST.Admin), usersController.updateUser)
    .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);


router.route('/airlines')
    .get(verifyRoles(ROLES_LIST.Admin), airlinesController.getAllAirlines)
    .post(verifyRoles(ROLES_LIST.Admin), airlinesController.createNewAirline)
    .put(verifyRoles(ROLES_LIST.Admin), airlinesController.updateAirline)
    .delete(verifyRoles(ROLES_LIST.Admin), airlinesController.deleteAirline);



module.exports = router;