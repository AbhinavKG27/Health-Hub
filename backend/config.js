const REQUIRED_ENV_VARS = ["DB_URL", "SECRET_KEY"];

const validateEnv = () => {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }

  if (process.env.SECRET_KEY.length < 32) {
    console.error("SECRET_KEY must be at least 32 characters long.");
    process.exit(1);
  }
};

const allowedOrigins = () => {
  const origins = process.env.CLIENT_ORIGIN || "http://localhost:3000,http://127.0.0.1:3000";
  return origins.split(",").map((origin) => origin.trim()).filter(Boolean);
};

const corsOptions = () => ({
  credentials: true,
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins().includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
});

const parseDurationMs = (value, fallbackMs) => {
  if (!value) return fallbackMs;

  const match = String(value).trim().match(/^(\d+)(ms|s|m|h|d)?$/i);
  if (!match) return fallbackMs;

  const amount = Number(match[1]);
  const unit = (match[2] || "ms").toLowerCase();

  const multipliers = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * multipliers[unit];
};

const jwtExpiresIn = () => process.env.JWT_EXPIRES_IN || "5h";

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production",
  sameSite: process.env.COOKIE_SAME_SITE || "lax",
  maxAge: parseDurationMs(jwtExpiresIn(), 5 * 60 * 60 * 1000),
});

module.exports = {
  validateEnv,
  corsOptions,
  jwtExpiresIn,
  cookieOptions,
};