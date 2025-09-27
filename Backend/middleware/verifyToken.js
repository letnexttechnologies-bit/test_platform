import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    // Read JWT token from cookies
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { studentId, fullname, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

export default verifyToken;
