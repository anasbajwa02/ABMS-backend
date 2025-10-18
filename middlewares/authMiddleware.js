const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError.js");

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) throw new ApiError(401, "No token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token");
  }
};

exports.checkRole = (requiredRoles = []) => {
  return (req, res, next) => {
    if (!requiredRoles.some((r) => req.user.roles.includes(r))) {
      throw new ApiError(403, "Access denied");
    }
    next();
  };
};
