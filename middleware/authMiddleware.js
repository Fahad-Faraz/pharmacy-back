import jwt from "jsonwebtoken"
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // FIX: strip "Bearer " prefix — frontend sends "Bearer <token>"
  // Without this fix, jwt.verify() fails for every single request
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;
 console.log(token)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
