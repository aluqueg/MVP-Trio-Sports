var express = require("express");
var router = express.Router();
const adminController = require("../controllers/adminControllers");

router.get("/", adminController.getAllUsers);
router.get("/getAllUsers", adminController.getAllUsers)
router.put("/disableUser", adminController.disableUser);
router.put("/disableSport/:sport_id", adminController.disableSport);
router.get("/prueba", adminController.prueba)


module.exports = router;
