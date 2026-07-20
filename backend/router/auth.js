const express = require("express");
const auth_controller = require("../controller/auth");
const { authLimiter, validate, schemas } = require("../middleware/security");
const auth_router = express.Router();
auth_router.post("/signup", authLimiter, validate(schemas.signupSchema), auth_controller.signup);
auth_router.post("/signin", authLimiter, validate(schemas.signinSchema), auth_controller.signin);
auth_router.post("/doctorsignin", authLimiter, validate(schemas.doctorSigninSchema), auth_controller.doctorsignin);
module.exports = auth_router;