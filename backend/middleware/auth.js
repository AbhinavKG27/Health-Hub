const jwt = require("jsonwebtoken");

const auth_middleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "authorization token missing" });
    }

    const bearer = token.split(" ");
    const verify = jwt.verify(bearer[1], process.env.SECRET_KEY);

    if (!verify || !verify.auth_user) {
      return res.status(401).json({ message: "un-authorized" });
    }

    req.id = verify.auth_user._id;
    req.is_admin = Boolean(verify.auth_user.is_admin);
    req.is_doctor = Boolean(verify.auth_user.is_doctor);
    req.auth_user = verify.auth_user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "authorization token expired" });
    }

    return res.status(401).json({ message: "invalid authorization token" });
  }
};

module.exports = auth_middleware;