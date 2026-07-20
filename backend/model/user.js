const mongoose = require("mongoose");

const user_schema = mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      minlength: 3,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      select: false,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"],
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
    },
    age: {
      type: String,
    },
    location: {
      type: String,
    },
    phone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("user", user_schema);
module.exports = user;