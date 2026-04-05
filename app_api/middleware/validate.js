/**
 * Input validation middleware for trip endpoints.
 *
 * Validates required fields and basic types before the request
 * reaches the controller, keeping validation logic out of controllers
 * and preventing malformed data from hitting the database.
 */

const VALID_SORT_FIELDS = ['start', 'name', 'perPerson', 'resort'];

/**
 * Validates query params for the GET /trips list endpoint.
 * Accepts: page, limit, sortBy, order, resort, minPrice, maxPrice
 */
const validateTripQuery = (req, res, next) => {
  const { page, limit, sortBy, order, resort, minPrice, maxPrice } = req.query;
  const errors = [];

  if (page !== undefined && (isNaN(page) || Number(page) < 1)) {
    errors.push('page must be a positive integer');
  }

  if (limit !== undefined && (isNaN(limit) || Number(limit) < 0)) {
    errors.push('limit must be a non-negative integer');
  }

  if (sortBy !== undefined && !VALID_SORT_FIELDS.includes(sortBy)) {
    errors.push(`sortBy must be one of: ${VALID_SORT_FIELDS.join(', ')}`);
  }

  if (order !== undefined && !['asc', 'desc'].includes(order)) {
    errors.push('order must be "asc" or "desc"');
  }

  if (resort !== undefined && (typeof resort !== 'string' || resort.trim() === '')) {
    errors.push('resort must be a non-empty string');
  }

  if (minPrice !== undefined && (isNaN(minPrice) || Number(minPrice) < 0)) {
    errors.push('minPrice must be a non-negative number');
  }

  if (maxPrice !== undefined && (isNaN(maxPrice) || Number(maxPrice) < 0)) {
    errors.push('maxPrice must be a non-negative number');
  }

  if (
    minPrice !== undefined &&
    maxPrice !== undefined &&
    Number(minPrice) > Number(maxPrice)
  ) {
    errors.push('minPrice cannot be greater than maxPrice');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Invalid query parameters', errors });
  }

  next();
};

/**
 * Validates the request body when creating or updating a trip.
 * All fields are required on POST; PUT allows partial updates.
 *
 * @param {boolean} requireAll - true for POST, false for PUT
 */
const validateTripBody = (requireAll = true) => (req, res, next) => {
  const { code, name, length, start, resort, perPerson, image, description } = req.body;
  const errors = [];

  if (requireAll) {
    if (!code || typeof code !== 'string' || code.trim() === '') {
      errors.push('code is required and must be a non-empty string');
    }
    if (!name || typeof name !== 'string' || name.trim() === '') {
      errors.push('name is required and must be a non-empty string');
    }
    if (!length || typeof length !== 'string' || length.trim() === '') {
      errors.push('length is required');
    }
    if (!start) {
      errors.push('start date is required');
    } else if (isNaN(Date.parse(start))) {
      errors.push('start must be a valid date');
    }
    if (!resort || typeof resort !== 'string' || resort.trim() === '') {
      errors.push('resort is required');
    }
    if (!perPerson || typeof perPerson !== 'string' || perPerson.trim() === '') {
      errors.push('perPerson is required');
    }
    if (!image || typeof image !== 'string' || image.trim() === '') {
      errors.push('image is required');
    }
    if (!description || typeof description !== 'string' || description.trim() === '') {
      errors.push('description is required');
    }
  } else {
    // For PUT: validate only fields that were provided
    if (start !== undefined && isNaN(Date.parse(start))) {
      errors.push('start must be a valid date');
    }
    const stringFields = { code, name, length, resort, perPerson, image, description };
    for (const [field, value] of Object.entries(stringFields)) {
      if (value !== undefined && (typeof value !== 'string' || value.trim() === '')) {
        errors.push(`${field} must be a non-empty string`);
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

module.exports = { validateTripQuery, validateTripBody };
