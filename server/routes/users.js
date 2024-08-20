var express = require('express');
var router = express.Router();
const userController = require('../controllers/userControllers');
const multerSingle = require('../middlewares/multerSingle')
const verifyToken = require('../middlewares/verifyToken')

/* GET users listing. */
router.post('/createUser',multerSingle("users"), userController.createUser);
router.post('/login', userController.login)
router.get('/profile',verifyToken, userController.profile)
router.put('/editUser', userController.editUser)
router.post('/emailValidator', userController.emailValidation)
router.post('/prueba',multerSingle("users"), userController.prueba)
router.get('/getUserActivities',verifyToken, userController.getUserActivities)
router.get('/getUserParticipatedActivities',verifyToken, userController.getUserParticipatedActivities)


module.exports = router;
