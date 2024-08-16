var express = require("express");
var router = express.Router();
const sportController = require("../controllers/sportControllers");

router.post("/createSport", sportController.createSport);

module.exports = router;
