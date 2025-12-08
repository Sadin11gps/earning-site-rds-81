const express = require("express");
const app = express();
app.use(express.json());

// Mock user data
let user = { id: 69, username: "Sadin11gps", balance: 1500, vipLevel: null };

const PRICES = { 1:300, 2:600, 3:1000, 4:2000, 5:4000, 6:6000, 7:8000, 8:10000 };

// Get user profile
app.get("/api/user/me", (req, res) => {
  res.json(user);
});

// Purchase VIP
app.post("/api/purchase/vip", (req, res) => {
  const level = Number(req.body.vipLevel);
  const price = PRICES[level];
  if (!price) return res.status(400).json({ error: "Invalid VIP level" });

  if (user.balance < price) {
    return res.status(400).json({ error: `Insufficient balance. Need ${price}, have ${user.balance}` });
  }

  user.balance -= price;
  user.vipLevel = level;
  res.json({ message: `Purchased VIP ${level}`, balance: user.balance, vipLevel: user.vipLevel });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

