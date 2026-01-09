const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // allow admin
  } else {
    return res.status(403).json({
      message: "Access denied: Admin only",
    });
  }
};

module.exports = { adminOnly };
