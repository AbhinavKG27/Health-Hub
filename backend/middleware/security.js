const isEmpty = (value) => value === undefined || value === null || value === "";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const objectIdRegex = /^[a-f\d]{24}$/i;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const securityHeaders = (req, res, next) => {
  res.removeHeader("X-Powered-By");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.setHeader("Origin-Agent-Cluster", "?1");
  next();
};

const createRateLimiter = ({ windowMs, max, message }) => {
  const hits = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
    const current = hits.get(key) || { count: 0, resetAt: now + windowMs };

    if (current.resetAt <= now) {
      current.count = 0;
      current.resetAt = now + windowMs;
    }

    current.count += 1;
    hits.set(key, current);

    res.setHeader("RateLimit-Limit", max);
    res.setHeader("RateLimit-Remaining", Math.max(max - current.count, 0));
    res.setHeader("RateLimit-Reset", Math.ceil(current.resetAt / 1000));

    if (current.count > max) {
      return res.status(429).json({ message });
    }

    next();
  };
};

const rules = {
  required: (field) => (value) => isEmpty(value) ? `${field} is required` : null,
  string: (field) => (value) => !isEmpty(value) && typeof value !== "string" ? `${field} must be a string` : null,
  number: (field) => (value) => !isEmpty(value) && Number.isNaN(Number(value)) ? `${field} must be a number` : null,
  email: (field) => (value) => !isEmpty(value) && !emailRegex.test(String(value)) ? `${field} must be a valid email` : null,
  objectId: (field) => (value) => !isEmpty(value) && !objectIdRegex.test(String(value)) ? `${field} must be a valid id` : null,
  array: (field) => (value) => !isEmpty(value) && !Array.isArray(value) ? `${field} must be an array` : null,
  date: (field) => (value) => !isEmpty(value) && Number.isNaN(Date.parse(value)) ? `${field} must be a valid date` : null,
  strongPassword: (field) => (value) => !isEmpty(value) && !strongPasswordRegex.test(String(value))
    ? `${field} must be at least 8 characters and include uppercase, lowercase, number, and special character`
    : null,
};

const validate = (schema) => (req, res, next) => {
  const errors = [];

  Object.entries(schema).forEach(([field, validators]) => {
    const value = req.body[field];
    validators.forEach((validator) => {
      const error = validator(field)(value);
      if (error) errors.push({ field, message: error });
    });
  });

  if (errors.length > 0) {
    return res.status(400).json({ message: "validation failed", errors });
  }

  next();
};

const authLimiter = createRateLimiter({
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 20,
  message: "Too many authentication attempts. Please try again later.",
});

const signupSchema = {
  username: [rules.required, rules.string],
  email: [rules.required, rules.string, rules.email],
  password: [rules.required, rules.string, rules.strongPassword],
};

const signinSchema = {
  username: [rules.required, rules.string],
  password: [rules.required, rules.string],
};

const doctorSigninSchema = {
  email: [rules.required, rules.string, rules.email],
  password: [rules.required, rules.string],
};

const doctorSchema = {
  name: [rules.required, rules.string],
  expertise: [rules.required, rules.array],
  image: [rules.required, rules.string],
  date: [rules.required, rules.array],
  email: [rules.required, rules.string, rules.email],
  password: [rules.required, rules.string, rules.strongPassword],
  desc: [rules.required, rules.string],
  contact: [rules.required, rules.string],
  ammount: [rules.required, rules.number],
};

const appointmentUpdateSchema = {
  _id: [rules.required, rules.objectId],
  status: [rules.required, rules.string],
  invoice: [rules.required, rules.string],
};

const paymentSchema = {
  _id: [rules.required, rules.objectId],
  status: [rules.required, rules.string],
};

const appointmentCreateSchema = {
  doctor: [rules.required, rules.objectId],
  disease: [rules.required, rules.string],
  date: [rules.required, rules.date],
};

const patientMessageSchema = {
  name: [rules.required, rules.string],
  email: [rules.required, rules.string, rules.email],
  contact: [rules.required, rules.string],
  message: [rules.required, rules.string],
};

const ambulanceSchema = {
  name: [rules.required, rules.string],
  phoneNumber: [rules.required, rules.string],
  address: [rules.required, rules.string],
  emergencyType: [rules.required, rules.string],
  city: [rules.required, rules.string],
  state: [rules.required, rules.string],
  zip: [rules.required, rules.string],
};

const patientUpdateSchema = {
  username: [rules.required, rules.string],
  email: [rules.required, rules.string, rules.email],
  phone: [rules.required, rules.string],
  gender: [rules.required, rules.string],
  age: [rules.required, rules.string],
  location: [rules.required, rules.string],
  password: [rules.string, rules.strongPassword],
};

const doctorUpdateSchema = {
  name: [rules.required, rules.string],
  image: [rules.required, rules.string],
  contact: [rules.required, rules.string],
  email: [rules.required, rules.string, rules.email],
  desc: [rules.required, rules.string],
  ammount: [rules.required, rules.number],
};

const dateUpdateSchema = {
  _id: [rules.required, rules.objectId],
  date: [rules.required, rules.date],
};

const medicineUpdateSchema = {
  _id: [rules.required, rules.objectId],
  medicine: [rules.required, rules.array],
  about: [rules.required, rules.string],
};

module.exports = {
  securityHeaders,
  authLimiter,
  validate,
  schemas: {
    signupSchema,
    signinSchema,
    doctorSigninSchema,
    doctorSchema,
    appointmentUpdateSchema,
    paymentSchema,
    appointmentCreateSchema,
    patientMessageSchema,
    ambulanceSchema,
    patientUpdateSchema,
    doctorUpdateSchema,
    dateUpdateSchema,
    medicineUpdateSchema,
  },
};