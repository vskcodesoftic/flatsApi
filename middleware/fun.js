require("dotenv").config();
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

module.exports = middlewares = {
  authenticateToken: async (req, res, next) => {
    try {
      if (!req.headers["x-access-token"]) {
        return res.status(401).json({
          error: "Key x-access-token not found",
        });
      }

      if (req.headers["x-access-token"] === "") {
        return res.status(401).json({
          error: "Token not found",
        });
      }

      const token = req.headers["x-access-token"];
      const data = await jwt.verify(token, keys.secretOrKey);
      if (!data) return res.status(401).json({ error: "Invalid token" });

      req.data = data;
      next();
    } catch (err) {
     return err;
    }
  },
};
