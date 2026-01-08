// roleMiddleware.js
module.exports = function(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: 'Not authorized to access this route' 
      });
    }
    next();
  };
};