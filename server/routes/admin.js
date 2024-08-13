var express = require('express')
var router = express.Router()
const adminController = require('../controllers/adminControllers')

router.get('/', adminController.getAllUsers);
router.put('/disableUser/:user_id', adminController.disableUser)
router.put('/enableUser/user_id', adminController.enableUser)


module.exports = router;