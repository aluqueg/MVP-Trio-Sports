var express = require('express');
var router = express.Router();
const userController = require('../controllers/userControllers');
const multerSingle = require('../middlewares/multerSingle');
const verifyToken = require('../middlewares/verifyToken');

/* GET users listing. */
router.post('/createUser',multerSingle("users"), userController.createUser);
router.post('/login', userController.login)
router.get('/profile',verifyToken, userController.profile)
router.get('/getPracticeSports',verifyToken, userController.getPracticeSports)
router.put('/editUser',verifyToken, userController.editUser)
router.post('/emailValidator', userController.emailValidation)
router.post('/prueba',multerSingle("users"), userController.prueba)
router.get('/getAllUsers', verifyToken, userController.getAllUsers)
router.get('/allMessages',verifyToken,userController.allMessages)
router.post('/viewOneChat',userController.viewOneChat)
router.post('/sendMessage',userController.sendMessage)
router.get('/getUserActivities',verifyToken, userController.getUserActivities)
router.get('/getUserParticipatedActivities',verifyToken, userController.getUserParticipatedActivities)
router.put('/validation/:token',userController.validationUser)
router.post('/recoverPassword', userController.recoverPassword)
router.put('/editPassword', userController.editPassword)
router.get('/getOneUser/:id', verifyToken, userController.getOneUser)
router.get('/getOneUserActivities/:id', verifyToken, userController.getOneUserActivities)
router.get('getOneUserParticipatedActivities/:id/1', verifyToken, userController.getOneUserParticipatedActivities)


module.exports = router;
