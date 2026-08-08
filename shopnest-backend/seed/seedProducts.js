const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("../config/db");
const Product = require("../models/Product");

const categories = {
  Shoes: [
    "Classic Running Sneaker",
    "Canvas Slip-On",
    "High-Top Basketball Shoe",
    "Leather Formal Oxford",
    "Trail Hiking Boot",
    "Lightweight Trainer",
  ],
  Bags: [
    "Leather Backpack",
    "Canvas Tote Bag",
    "Travel Duffel Bag",
    "Laptop Messenger Bag",
    "Drawstring Gym Sack",
  ],
  Electronics: [
    "Wireless Headphones",
    "Bluetooth Speaker",
    "Smartwatch",
    "Portable Power Bank",
    "Mechanical Keyboard",
    "Wireless Mouse",
  ],
  Clothing: [
    "Cotton Hoodie",
    "Denim Jacket",
    "Graphic T-Shirt",
    "Slim Fit Jeans",
    "Cotton Joggers",
    "Wool Sweater",
  ],
  Accessories: [
    "Stainless Steel Water Bottle",
    "Leather Wallet",
    "Aviator Sunglasses",
    "Analog Wrist Watch",
    "Canvas Cap",
  ],
};

const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateProducts = () => {
  const products = [];
  let seedCounter = 1;

  for (const category in categories) {
    categories[category].forEach((name) => {
      products.push({
        name,
        description: `${name} — a great addition to your ${category.toLowerCase()} collection. Comfortable, durable, and built to last.`,
        price: randomBetween(499, 5999),
        category,
        image: `https://picsum.photos/seed/product${seedCounter}/600/600`,
        stock: randomBetween(5, 50),
      });
      seedCounter++;
    });
  }

  return products;
};

const importProducts = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});
    console.log("Existing products cleared");

    const sampleProducts = generateProducts();
    await Product.insertMany(sampleProducts);
    console.log(`${sampleProducts.length} products seeded successfully`);

    process.exit();
  } catch (error) {
    console.error(`Error seeding products: ${error.message}`);
    process.exit(1);
  }
};

importProducts();