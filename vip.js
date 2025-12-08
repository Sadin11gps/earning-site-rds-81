// vip.js

const API_BASE = "/api";

// Helper: get token from localStorage
function getToken() {
  return localStorage.getItem("token");
}

// Update wallet UI
function updateWalletUI(data) {
  document.getElementById("balanceTk").textContent = data.balance + " Tk";
  document.getElementById("vipLevelText").textContent = data.vipLevel ? "VIP_" + data.vipLevel : "Not assigned";
  // চাইলে daily task limit দেখানোর জন্য আলাদা span যোগ করতে পারো
  if (document.getElementById("dailyTaskLimit")) {
    document.getElementById("dailyTaskLimit").textContent = data.dailyTaskLimit;
  }
}

// Load user info on page load
async function loadUserInfo() {
  const token = getToken();
  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/user/me`, {
      headers: { Authorization: "Bearer " + token }
    });
    const data = await res.json();
    if (res.ok) {
      updateWalletUI(data);
    } else {
      alert(data.error || "Failed to load user info");
    }
  } catch (err) {
    alert("Network error");
  }
}

// Purchase VIP
async function initiatePurchase(vipLevel) {
  const token = getToken();
  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/purchase/${vipLevel}`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token }
    });
    const data = await res.json();
    if (res.ok) {
      alert("Purchase successful!");
      updateWalletUI(data);
    } else {
      alert(data.error || "Purchase failed");
    }
  } catch (err) {
    alert("Network error");
  }
}

// Run on page load
window.addEventListener("DOMContentLoaded", loadUserInfo);

