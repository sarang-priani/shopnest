const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

let isReconnecting = false;

async function ensureConnection(req, res, next) {
  if (mongoose.connection.readyState === 1) return next();
  if (isReconnecting) {
    return res.status(503).json({ message: "Database reconnecting, try again" });
  }
  isReconnecting = true;
  try {
    await connectDB(3);
    isReconnecting = false;
    next();
  } catch {
    isReconnecting = false;
    return res.status(503).json({ message: "Database unavailable" });
  }
}

app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.json({ status: dbState === 1 ? "OK" : "DEGRADED", db: states[dbState] || "unknown" });
});

app.use("/api/auth", ensureConnection, authRoutes);
app.use("/api/products", ensureConnection, productRoutes);
app.use("/api/products/:productId/reviews", ensureConnection, reviewRoutes);
app.use("/api/wishlist", ensureConnection, wishlistRoutes);
app.use("/api/cart", ensureConnection, cartRoutes);
app.use("/api/orders", ensureConnection, orderRoutes);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
