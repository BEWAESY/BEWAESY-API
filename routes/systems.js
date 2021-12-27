var express = require('express');
var router = express.Router();

var system_controller = require("../controllers/systems")

router.get("/should-water", system_controller.shouldWater);
router.get("/watered-plant", system_controller.wateredPlant);

module.exports = router;
