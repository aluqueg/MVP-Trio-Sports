var express = require("express");
var router = express.Router();
const sportController = require("../controllers/sportControllers");
const verifyToken = require('../middlewares/verifyToken'); 


router.post("/createSport", sportController.createSport);
router.get("/allSports", sportController.getAllSports);

module.exports = router;

