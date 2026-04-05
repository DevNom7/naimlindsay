const express = require('express');
const router = express.Router();

const ctrlTrips = require('../controllers/trips');
const ctrlAuth = require('../controllers/authentication');

// Importing custom middlewares. 
// Note to self: The order we pass these into the route definitions is crucial!
const { auth } = require('../config/jwt');
const { requireAdmin } = require('../middleware/rbac');
const { validateTripQuery, validateTripBody } = require('../middleware/validate');
const { cacheTrips, clearCache } = require('../middleware/cache');

// === PUBLIC ROUTES ===
// Anyone can read trips. We pipe requests through the custom LRU cache first to save DB calls.
// The GET collection also passes through a query validator to handle ?page, ?limit, etc.
router.get('/trips', validateTripQuery, cacheTrips, ctrlTrips.tripsList);

// GET single trip by code
router.get('/trips/:tripCode', cacheTrips, ctrlTrips.tripsFindByCode);

// === PROTECTED ROUTES ===
// Security pipeline: 1) Check JWT (auth), 2) Check Admin role (requireAdmin)
// 3) Clear stale cache (clearCache), 4) Validate payload (validateTripBody)

// POST create new trip — requires all fields (true)
router.post('/trips', auth, requireAdmin, clearCache, validateTripBody(true), ctrlTrips.tripsAddTrip);

// PUT update trip by code — allows partial body updates (false)
router.put('/trips/:tripCode', auth, requireAdmin, clearCache, validateTripBody(false), ctrlTrips.tripsUpdateTrip);

// DELETE remove trip by code
router.delete('/trips/:tripCode', auth, requireAdmin, clearCache, ctrlTrips.tripsDeleteTrip);

// === AUTH ROUTES ===
// Endpoints for generating JWTs
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;