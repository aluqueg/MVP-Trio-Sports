var express = require('express');
var router = express.Router();
const userController = require('../controllers/userControllers');

/* GET users listing. */
router.post('/createUser', userController.createUser);
router.post('/login', userController.login)
router.get('/profile', userController.profile)
router.put('/editUser', userController.editUser)
router.post('/emailValidator', userController.emailValidation)

module.exports = router;
