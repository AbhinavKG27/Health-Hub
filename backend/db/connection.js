const mongoose = require("mongoose");

const DEFAULT_PORT = 8080;

const mongoose_connection = async (app) => {
  const dbUrl = process.env.DB_URL;
  const port = process.env.PORT || DEFAULT_PORT;

  if (!dbUrl) {
    console.error("DB_URL is not defined. Create backend/.env from backend/.env.example and set DB_URL.");
    process.exit(1);
  }

  try {
    await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 10000,
    });
    console.log("db connected success");

    app.listen(port, "0.0.0.0", () => {
      console.log(`listening at port ${port}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = mongoose_connection;