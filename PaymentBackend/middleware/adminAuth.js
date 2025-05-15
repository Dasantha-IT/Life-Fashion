import jwt from "jsonwebtoken";

const adminAuth = (allowedRoles) => {
  return (req, res, next) => {
    try {
      let token;

      // Accept both Authorization and token headers
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
      ) {
        token = req.headers.authorization.split(" ")[1];
      } else if (req.headers.token) {
        token = req.headers.token;
      }

      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "Token missing" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!allowedRoles.includes(decoded.role)) {
        return res
          .status(403)
          .json({ success: false, message: "Unauthorized role" });
      }

      req.admin = decoded;
      next();
    } catch (error) {
      console.error("Admin Auth Error:", error);
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  };
};

export default adminAuth;
