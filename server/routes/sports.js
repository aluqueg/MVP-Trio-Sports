var express = require("express");
var router = express.Router();
const sportController = require("../controllers/sportControllers");
const verifyToken = require('../middlewares/verifyToken'); 


router.post("/createSport", verifyToken, sportController.createSport);
router.get("/allSports", verifyToken, sportController.getAllSports);

module.exports = router;

