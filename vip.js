// Demo balance (backend থেকে আসবে)
let userBalance = 0;
let userVipLevel = null;

const VIP_PRICES = {
  1: 300,
  2: 600,
  3: 1000,
  4: 2000,
  5: 3000,
  6: 4500,
  7: 7000,
  8: 15000,
};

function updateWalletUI() {
  document.getElementById("balanceTk").textContent = userBalance;
  document.getElementById("vipLevelText").textContent = userVipLevel ? `VIP ${userVipLevel}` : "Not assigned";
}

function initiatePurchase(level) {
  const price = VIP_PRICES[level];
  if (userBalance >= price) {
    userBalance -= price;
    userVipLevel = level;
    alert(`✅ Purchase successful! You are now VIP ${level}. Remaining balance: ${userBalance} Tk`);
    updateWalletUI();
    // TODO: backend API call করে server এ update করতে হবে
  } else {
    alert(`❌ Not enough balance. Need ${price} Tk, you have ${userBalance} Tk`);
  }
}

document.addEventListener("DOMContentLoaded", updateWalletUI);

