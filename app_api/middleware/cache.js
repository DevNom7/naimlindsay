const LRUCache = require('../utils/lruCache');

// Initialize cache with a capacity of 50 unique requests
const tripCache = new LRUCache(50);

const cacheTrips = (req, res, next) => {
    if (req.method !== 'GET') {
        return next();
    }

    const key = req.originalUrl;
    const cachedResponse = tripCache.get(key);

    if (cachedResponse) {
        console.log(`[Cache HIT] ${key}`);
        return res.json(cachedResponse);
    }

    console.log(`[Cache MISS] ${key}`);
    const originalJson = res.json.bind(res);

    // Intercept the response to cache it before sending
    res.json = (body) => {
        tripCache.put(key, body);
        originalJson(body);
    };

    next();
};

const clearCache = (req, res, next) => {
    console.log('[Cache CLEARED] State modifying request detected.');
    tripCache.clear();
    next();
};

module.exports = { cacheTrips, clearCache, tripCache };