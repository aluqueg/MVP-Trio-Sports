var express = require('express');
var router = express.Router();
const activityController = require('../controllers/activityControllers')

router.post('/createActivity', activityController.createActivity)
router.put('/editActivity', activityController.editActivity)
router.get('/getAllActivities', activityController.getAllActivities)
router.get('/getOneActivity/:activity_id', activityController.getOneActivity)
router.put('/joinActivity', activityController.joinActivity);

module.exports = router;