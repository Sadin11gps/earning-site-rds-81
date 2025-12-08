// vip.js

// প্রতিটি VIP এর config (price, daily task, limit)
const vipConfig = {
  1: { price: 300, dailyTask: 10, limitDays: 30 },
  2: { price: 600, dailyTask: 15, limitDays: 30 },
  3: { price: 1000, dailyTask: 22, limitDays: 30 },
  4: { price: 2000, dailyTask: 30, limitDays: 30 },
  5: { price: 3000, dailyTask: 40, limitDays: 30 },
  6: { price: 4500, dailyTask: 75, limitDays: 30 },
  7: { price: 7000, dailyTask: 150, limitDays: 30 },
  8: { price: 15000, dailyTask: 300, limitDays: 30 }
};

// ইউজারের ডেটা লোড করা হবে
function loadUserData() {
  const balance = localStorage.getItem("balance") || 0;
  const vipLevel = localStorage.getItem("vipLevel") || "Not assigned";
  const dailyTaskLimit = localStorage.getItem("dailyTaskLimit") || 0;
  const vipExpiry = localStorage.getItem("vipExpiry") || "Not set";

  document.getElementById("balanceTk").textContent = balance + " Tk";
  document.getElementById("vipLevelText").textContent = vipLevel;
  
  // যদি তোমার vip.html এ dailyTaskLimit আর expiry দেখানোর span থাকে
  const dailyTaskEl = document.getElementById("dailyTaskLimit");
  const expiryEl = document.getElementById("vipExpiryDate");
  if (dailyTaskEl) dailyTaskEl.textContent = dailyTaskLimit;
  if (expiryEl) expiryEl.textContent = vipExpiry;
}

// VIP কিনলে ব্যালেন্স কমবে এবং VIP লেভেল + Task Limit + Expiry আপডেট হবে
function initiatePurchase(vipId) {
  let balance = parseInt(localStorage.getItem("balance") || "0");
  const config = vipConfig[vipId];

  if (!config) {
    alert("❌ Invalid VIP package.");
    return;
  }

  if (balance >= config.price) {
    balance -= config.price;
    localStorage.setItem("balance", balance);
    localStorage.setItem("vipLevel", "VIP_" + vipId);
    localStorage.setItem("dailyTaskLimit", config.dailyTask);

    // Expiry date হিসাব করা
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + config.limitDays);
    localStorage.setItem("vipExpiry", expiryDate.toDateString());

    alert("✅ Purchase successful! You are now " + "VIP_" + vipId);
    loadUserData(); // রিয়েল‑টাইমে UI আপডেট হবে
  } else {
    alert("❌ Balance কম আছে। Please recharge.");
  }
}

// পেজ লোড হলে ডেটা দেখাবে
document.addEventListener("DOMContentLoaded", loadUserData);

