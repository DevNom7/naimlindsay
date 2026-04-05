// Middleware to check if the authenticated user has the 'admin' role
const requireAdmin = (req, res, next) => {
    if (req.auth && req.auth.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
};

module.exports = {
    requireAdmin
};