const jwt = require('jsonwebtoken'); 
const authCheck = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).json({
      status: 403,
      message: "A token is required",
    });
  }
  try {
    const decoded = jwt.verify(token, "kdjkfjdkjf");
    req.user = decoded;
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Invalid token",
    });
  }
  next();
};
module.exports = {authCheck};