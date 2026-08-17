const mongoose = require("mongoose");

const connectDB = async (retries = 5) => {
  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected. Attempting to reconnect...");
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });

  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        tlsAllowInvalidCertificates: true,
        serverSelectionTimeoutMS: 10000,
        heartbeatFrequencyMS: 10000,
        maxPoolSize: 10,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${i + 1}/${retries} failed: ${error.message}`);
      if (i < retries - 1) {
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }
  console.error("Could not connect to MongoDB after all retries. Exiting.");
  process.exit(1);
};

module.exports = connectDB;
