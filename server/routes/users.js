var express = require('express');
var router = express.Router();
const userController = require('../controllers/userControllers');
const multerSingle = require('../middlewares/multerSingle')
const verifyToken = require('../middlewares/verifyToken')

/* GET users listing. */
router.post('/createUser',multerSingle("users"), userController.createUser);
router.post('/login', userController.login)
router.get('/profile', userController.profile)
router.put('/editUser', userController.editUser)
router.post('/emailValidator', userController.emailValidation)
router.post('/prueba',multerSingle("users"), userController.prueba)
router.get('/getAllUsers', userController.getAllUsers)


module.exports = router;
