const jwt = require("jsonwebtoken");

// Middleware to check JWT token and role
const authMiddleware = (role = []) => {
  return (request, response, next) => {
    // Get the token from the header
    const token = request.headers.authorization?.split(" ")[1];
    if (!token)
      return response
        .status(401)
        .json({ error: "Access denied. No token provided" });

    // Verify the token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      request.body.createdBy = decoded.id;
      request.body.addedBy = decoded.id;
      request.body.updatedBy = decoded.id;
      console.log("Middleware Added createdBy:", request.body.createdBy);
      console.log("Middleware Added addedBy:", request.body.addedBy);
      if (role.length && !role.includes(decoded.role)) {
        return response
          .status(403)
          .json({ error: "Access denied. Unauthorized role" });
      }
      request.user = decoded;
      next();
    } catch (error) {
      console.error("JWT Error:", error.message);
      return response.status(401).json({ error: "Invalid or Expired token" });
    }
  };
};

module.exports = authMiddleware;
