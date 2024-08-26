var express = require('express');
var router = express.Router();
const activityController = require('../controllers/activityControllers')
const verifyToken = require('../middlewares/verifyToken');


router.post('/createActivity', verifyToken, activityController.createActivity)
router.put('/editActivity', verifyToken, activityController.editActivity)
router.get('/getAllActivities', verifyToken, activityController.getAllActivities)
router.get('/getOneActivity/:activity_id', verifyToken, activityController.getOneActivity)
router.put('/joinActivity', verifyToken, activityController.joinActivity);
router.put('/leaveActivity', verifyToken, activityController.leaveActivity);


module.exports = router;