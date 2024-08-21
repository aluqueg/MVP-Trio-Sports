const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentControllers');

router.get('/getCommentsByActivity/:activity_id', commentController.getCommentsByActivity);
router.post('/addComment', commentController.addComment);

module.exports = router;
