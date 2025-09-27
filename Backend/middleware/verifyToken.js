// middleware/verifyToken.js
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    // Try cookie first, then Authorization header (Bearer token)
    const cookieToken = req.cookies?.token;
    let token = cookieToken;

    if (!token) {
      const authHeader = req.headers?.authorization || "";
      if (authHeader.startsWith("Bearer ")) token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { studentId, fullname, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
  }
};

export default verifyToken;
