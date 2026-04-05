const Trip = require('../models/travlr');

/**
 * Retrieves trips from the database using an aggregation pipeline.
 *
 * The pipeline handles four concerns in sequence:
 *   1. Filter  - match documents by resort (regex) and/or numeric price range
 *   2. Sort    - order results by a chosen field
 *   3. Paginate - skip and limit for page-based access
 *   4. Project  - remove the computed _numericPrice field from the output
 *
 * Price filtering requires a computed step because the perPerson field is
 * stored as a string (e.g. "1,495"). The pipeline uses $addFields to strip
 * non-digit/period characters and cast the result to a double so it can be
 * compared numerically.
 *
 * @param {object} options
 * @param {string}  [options.sortBy='start']   - Field to sort by
 * @param {string}  [options.order='asc']      - 'asc' or 'desc'
 * @param {number}  [options.page=1]           - Page number (1-indexed)
 * @param {number}  [options.limit=0]          - Results per page (0 = no limit)
 * @param {string}  [options.resort]           - Case-insensitive resort filter
 * @param {number}  [options.minPrice]         - Minimum price (inclusive)
 * @param {number}  [options.maxPrice]         - Maximum price (inclusive)
 * @returns {Promise<{ trips: Trip[], total: number }>}
 */
const getAllTrips = async ({
  sortBy = 'start',
  order = 'asc',
  page = 1,
  limit = 0,
  resort,
  minPrice,
  maxPrice,
} = {}) => {
  const pipeline = [];

  // Step 1a: compute a numeric price field so we can filter by range.
  // Strip commas, dollar signs, and spaces, then cast to double.
  // This avoids storing a duplicate numeric field in the schema.
  pipeline.push({
    $addFields: {
      _numericPrice: {
        $toDouble: {
          $replaceAll: {
            input: {
              $replaceAll: {
                input: { $replaceAll: { input: '$perPerson', find: ',', replacement: '' } },
                find: '$',
                replacement: '',
              },
            },
            find: ' ',
            replacement: '',
          },
        },
      },
    },
  });

  // Step 1b: build the $match filter.
  const matchStage = {};

  if (resort) {
    // Case-insensitive partial match on resort name
    matchStage.resort = { $regex: resort, $options: 'i' };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    matchStage._numericPrice = {};
    if (minPrice !== undefined) matchStage._numericPrice.$gte = minPrice;
    if (maxPrice !== undefined) matchStage._numericPrice.$lte = maxPrice;
  }

  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  // Step 2: sort before paginating so page boundaries are stable.
  const sortOrder = order === 'desc' ? -1 : 1;
  pipeline.push({ $sort: { [sortBy]: sortOrder } });

  // Run a parallel count pipeline to get the total matching documents.
  const countPipeline = [...pipeline, { $count: 'total' }];

  // Step 3: pagination - skip to the correct page then limit the window.
  if (limit > 0) {
    const skip = (page - 1) * limit;
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });
  }

  // Step 4: remove the computed helper field from output documents.
  pipeline.push({ $project: { _numericPrice: 0 } });

  const [trips, countResult] = await Promise.all([
    Trip.aggregate(pipeline),
    Trip.aggregate(countPipeline),
  ]);

  const total = countResult.length > 0 ? countResult[0].total : 0;

  return { trips, total };
};

/**
 * Finds a single trip by its trip code.
 *
 * @param {string} tripCode
 * @returns {Promise<Trip|null>}
 */
const getTripByCode = async (tripCode) => {
  return Trip.findOne({ code: tripCode }).exec();
};

/**
 * Creates a new trip document.
 *
 * @param {object} tripData - Fields matching the Trip schema
 * @returns {Promise<Trip>}
 */
const createTrip = async (tripData) => {
  return Trip.create(tripData);
};

/**
 * Updates an existing trip identified by trip code.
 *
 * @param {string} tripCode
 * @param {object} tripData - Fields to update
 * @returns {Promise<Trip|null>}
 */
const updateTrip = async (tripCode, tripData) => {
  return Trip.findOneAndUpdate(
    { code: tripCode },
    tripData,
    { new: true, runValidators: true }
  );
};

/**
 * Deletes a trip by its trip code.
 *
 * @param {string} tripCode
 * @returns {Promise<Trip|null>}
 */
const deleteTrip = async (tripCode) => {
  return Trip.findOneAndDelete({ code: tripCode });
};

module.exports = {
  getAllTrips,
  getTripByCode,
  createTrip,
  updateTrip,
  deleteTrip,
};
