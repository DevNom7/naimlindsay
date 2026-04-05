const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips');

router.get('/trips', tripsController.tripsList);
router.get('/trips/:code', tripsController.tripsFindByCode);
router.post('/trips', tripsController.tripsAddTrip);
router.put('/trips/:code', tripsController.tripsUpdateTrip);
router.delete('/trips/:code', tripsController.tripsDeleteTrip);

module.exports = router;
