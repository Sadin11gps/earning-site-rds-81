const API_BASE = "/api";

// Helper functions
function showMessage(id, text, type = "error") {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.style.display = "block";
  el.className = type; // "error" বা "success"
}

// Register form logic
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;
    const referral = document.getElementById("referral").value.trim();

    if (!name || !email || !password || !confirm) {
      showMessage("msgError", "সব ঘর পূরণ করুন।", "error");
      return;
    }
    if (password.length < 6) {
      showMessage("msgError", "পাসওয়ার্ড কমপক্ষে 6 অক্ষরের হতে হবে।", "error");
      return;
    }
    if (password !== confirm) {
      showMessage("msgError", "পাসওয়ার্ড মিলছে না।", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, referralCode: referral })
      });
      const data = await res.json();
      if (!res.ok) {
        showMessage("msgError", data.error || "রেজিস্ট্রেশন ব্যর্থ হয়েছে।", "error");
      } else {
        showMessage("msgSuccess", data.message || "রেজিস্ট্রেশন সফল।", "success");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1200);
      }
    } catch (err) {
      showMessage("msgError", "নেটওয়ার্ক সমস্যা। পরে চেষ্টা করুন।", "error");
    }
  });
}

// Login form logic
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
      showMessage("loginError", "সব ঘর পূরণ করুন।", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        showMessage("loginError", data.error || "লগইন ব্যর্থ হয়েছে।", "error");
      } else {
        showMessage("loginSuccess", "লগইন সফল।", "success");
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("referralCode", data.referralCode);
        setTimeout(() => {
          window.location.href = "vip.html";
        }, 1200);
      }
    } catch (err) {
      showMessage("loginError", "নেটওয়ার্ক সমস্যা। পরে চেষ্টা করুন।", "error");
    }
  });
}

