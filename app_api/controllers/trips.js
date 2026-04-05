const tripService = require('../services/tripService');

/**
 * GET /api/trips
 * Returns a list of trips. Supports pagination, sorting, and filtering via
 * query parameters: page, limit, sortBy, order, resort, minPrice, maxPrice.
 *
 * Pagination metadata is returned in response headers so the array body
 * format stays compatible with existing clients:
 *   X-Total-Count  - total matching documents
 *   X-Total-Pages  - total pages (only set when limit > 0)
 *   X-Current-Page - current page number
 */
const tripsList = async (req, res, next) => {
  try {
    const { page, limit, sortBy, order, resort, minPrice, maxPrice } = req.query;

    const parsedPage  = page  ? Number(page)  : 1;
    const parsedLimit = limit ? Number(limit) : 0;

    const { trips, total } = await tripService.getAllTrips({
      page:     parsedPage,
      limit:    parsedLimit,
      sortBy:   sortBy   || 'start',
      order:    order    || 'asc',
      resort:   resort   || undefined,
      minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
    });

    res.set('X-Total-Count',  String(total));
    res.set('X-Current-Page', String(parsedPage));
    if (parsedLimit > 0) {
      res.set('X-Total-Pages', String(Math.ceil(total / parsedLimit)));
    }

    res.status(200).json(trips);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/trips/:tripCode
 * Returns a single trip matching the provided trip code.
 */
const tripsFindByCode = async (req, res, next) => {
  try {
    const trip = await tripService.getTripByCode(req.params.tripCode);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.status(200).json(trip);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/trips  (protected)
 * Creates a new trip. Request body is validated by middleware before
 * this handler runs.
 */
const tripsAddTrip = async (req, res, next) => {
  try {
    const newTrip = await tripService.createTrip(req.body);
    res.status(201).json(newTrip);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/trips/:tripCode  (protected)
 * Updates an existing trip by trip code.
 */
const tripsUpdateTrip = async (req, res, next) => {
  try {
    const trip = await tripService.updateTrip(req.params.tripCode, req.body);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.status(200).json(trip);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/trips/:tripCode  (protected)
 * Removes a trip by trip code.
 */
const tripsDeleteTrip = async (req, res, next) => {
  try {
    const trip = await tripService.deleteTrip(req.params.tripCode);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip,
  tripsDeleteTrip,
};
