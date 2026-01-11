// HOME / INDEX - status login (Bearer Token)

// elemen di hero
const loggedBox = document.querySelector(".user-info-logged");
const guestBox = document.querySelector(".user-info-guest");
const helloText = loggedBox?.querySelector(".hello-text");

// backend FastAPI
const API_BASE_URL = "http://127.0.0.1:8000";

// tombol
const loginBtn = document.getElementById("btn-login");
const registerBtn = document.getElementById("btn-register");

function setLoggedIn(name) {
  if (helloText && name) {
    helloText.textContent = "Hi " + name;
  }
  guestBox?.classList.add("hidden");
  loggedBox?.classList.remove("hidden");
}

function setGuest() {
  loggedBox?.classList.add("hidden");
  guestBox?.classList.remove("hidden");
}

async function fetchCurrentUser() {
  try {
    const token = localStorage.getItem("auth_token");
    const cachedName = localStorage.getItem("username");

    // kalau belum ada token, tampilkan guest
    if (!token) {
      setGuest();
      return;
    }

    // biar UI responsif, tampilkan nama cache dulu (kalau ada)
    if (cachedName) {
      setLoggedIn(cachedName);
    }

    const res = await fetch(API_BASE_URL + "/api/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      // token tidak valid/expired -> logout local
      localStorage.removeItem("auth_token");
      localStorage.removeItem("username");
      setGuest();
      return;
    }

    if (!res.ok) {
      // kalau error lain (misal 500), jangan logout, cukup tampilkan guest atau biarkan cache
      console.error("Gagal ambil user:", res.status);
      return;
    }

    const data = await res.json(); // { id, name, email }
    if (data?.name) {
      localStorage.setItem("username", data.name);
      localStorage.setItem("user_email", data.email || "");
      setLoggedIn(data.name);
    } else {
      setGuest();
    }
  } catch (err) {
    console.error("Gagal ambil data user:", err);
    // kalau jaringan error, biarkan state yang terakhir (cache) atau tampilkan guest jika tidak ada
    const cachedName = localStorage.getItem("username");
    if (!cachedName) setGuest();
  }
}

// jalan setelah DOM siap
document.addEventListener("DOMContentLoaded", () => {
  fetchCurrentUser();

  loginBtn?.addEventListener("click", () => {
    // simpan supaya setelah login bisa balik ke halaman ini
    localStorage.setItem("redirect_after_login", window.location.href);
    window.location.href = "login.html";
  });

  registerBtn?.addEventListener("click", () => {
    localStorage.setItem("redirect_after_login", window.location.href);
    window.location.href = "register.html";
  });
});
