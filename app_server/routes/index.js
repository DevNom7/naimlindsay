// defines the routes used by the application

var express = require('express');
var router = express.Router();

var ctrlMain = require('../controllers/main');
var ctrlTravel = require('../controllers/travel');

router.get('/', ctrlMain.index);
router.get('/travel', ctrlTravel.travel);

module.exports = router;
