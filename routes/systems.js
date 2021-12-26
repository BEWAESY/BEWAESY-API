var express = require('express');
var router = express.Router();

var system_controller = require("../controllers/systems")

router.get("/water", system_controller.water);

module.exports = router;
