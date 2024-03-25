const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/admin/usersController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');


router.route('/users')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
    .post(verifyRoles(ROLES_LIST.Admin), usersController.createNewUser)
    .put(verifyRoles(ROLES_LIST.Admin), usersController.updateUser)
    .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);



module.exports = router;