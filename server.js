const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// MongoDB connect (update URI as needed)
mongoose.connect("mongodb://localhost:27017/earningSite", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  userId: { type: Number, unique: true },
  referralCode: String,
  referredBy: String,
  balance: { type: Number, default: 0 },
  vipLevel: { type: Number, default: null },
  dailyTaskLimit: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);

// Auto-increment counter (demo)
let counter = 1;

// VIP packages data
const VIP_PACKAGES = {
  1: { price: 300, cashback: 0, dailyTask: 10, limitDays: 30, totalIncome: 1500 },
  2: { price: 600, cashback: 0, dailyTask: 15, limitDays: 30, totalIncome: 2250 },
  3: { price: 1000, cashback: 30, dailyTask: 22, limitDays: 30, totalIncome: 3300 },
  4: { price: 2000, cashback: 70, dailyTask: 30, limitDays: 30, totalIncome: 4500 },
  5: { price: 3000, cashback: 150, dailyTask: 40, limitDays: 30, totalIncome: 6000 },
  6: { price: 4500, cashback: 250, dailyTask: 75, limitDays: 30, totalIncome: 11250 },
  7: { price: 7000, cashback: 500, dailyTask: 150, limitDays: 30, totalIncome: 22500 },
  8: { price: 15000, cashback: 1500, dailyTask: 300, limitDays: 30, totalIncome: 45000 },
};

// Register route
app.post("/api/register", async (req, res) => {
  const { name, email, password, referralCode } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashed,
      userId: counter,
      referralCode: "REF" + counter,
      referredBy: referralCode || null,
      balance: 0,
      vipLevel: null,
      dailyTaskLimit: 0,
    });

    counter++;
    await newUser.save();

    res.json({
      message: "Registration successful",
      userId: newUser.userId,
      referralCode: newUser.referralCode,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ userId: user.userId }, "secretKey");

    res.json({
      message: "Login successful",
      token,
      userId: user.userId,
      referralCode: user.referralCode,
      balance: user.balance,
      vipLevel: user.vipLevel,
      dailyTaskLimit: user.dailyTaskLimit,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Middleware to verify token
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "secretKey");
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// VIP purchase route
app.post("/api/purchase/:vipLevel", authMiddleware, async (req, res) => {
  const vipLevel = parseInt(req.params.vipLevel);
  const packageData = VIP_PACKAGES[vipLevel];
  if (!packageData) return res.status(400).json({ error: "Invalid VIP level" });

  try {
    const user = await User.findOne({ userId: req.userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.balance < packageData.price) {
      return res.status(400).json({ error: "Not enough balance" });
    }

    // Deduct price, add cashback, set VIP level and daily task limit
    user.balance = user.balance - packageData.price + packageData.cashback;
    user.vipLevel = vipLevel;
    user.dailyTaskLimit = packageData.dailyTask;

    await user.save();

    res.json({
      message: "Purchase successful",
      balance: user.balance,
      vipLevel: user.vipLevel,
      dailyTaskLimit: user.dailyTaskLimit,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get user info (real-time balance, VIP, tasks)
app.get("/api/user/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      userId: user.userId,
      balance: user.balance,
      vipLevel: user.vipLevel,
      dailyTaskLimit: user.dailyTaskLimit,
      referralCode: user.referralCode,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

