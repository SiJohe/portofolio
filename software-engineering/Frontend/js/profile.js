const API_BASE_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("btn-back");
  const guestBox = document.querySelector(".user-guest");
  const loggedBox = document.querySelector(".user-logged");

  const nameGuest = document.getElementById("profile-name");
  const nameLogged = document.getElementById("profile-name-logged");
  const avatar = document.getElementById("profile-avatar");

  const loginBtn = document.getElementById("btn-login");
  const registerBtn = document.getElementById("btn-register");

  const logoutBtn = document.getElementById("btn-logout");

  
  logoutBtn?.addEventListener("click", async () => {
    // kalau backend kamu punya endpoint logout, boleh panggil di sini (opsional)
    // try { await fetch(API_BASE_URL + "/api/auth/logout", { method: "POST" }); } catch {}

    localStorage.removeItem("auth_token");
    localStorage.removeItem("username");
    localStorage.removeItem("user_email");

    // balik ke mode guest
    guestBox?.classList.remove("hidden");
    loggedBox?.classList.add("hidden");
    logoutBtn?.classList.add("hidden");
    if (nameGuest) nameGuest.textContent = "Guest";

    // optional: reset avatar ke default
    // if (avatar) avatar.src = "../assets/cat-profile.jpg";
  });

  
  // back
  backBtn?.addEventListener("click", () => window.location.href = "./index.html");

  // default guest
  if (nameGuest) nameGuest.textContent = "Guest";

  // auth buttons
  loginBtn?.addEventListener("click", () => window.location.href = "./login.html");
  registerBtn?.addEventListener("click", () => window.location.href = "./register.html");

  // klik menu card
  document.querySelectorAll(".profile-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      if (target) window.location.href = `./${target}`;
    });
  });
  

  // fetch user
  fetchCurrentUser();

  async function fetchCurrentUser() {
    try {
      const token = localStorage.getItem("auth_token");
      const cachedName = localStorage.getItem("username");

      // kalau belum login, tetap guest
      if (!token) {
        guestBox?.classList.remove("hidden");
        loggedBox?.classList.add("hidden");
        logoutBtn?.classList.add("hidden");
        if (cachedName && nameGuest) nameGuest.textContent = cachedName; // opsional
        return;
      }

      const res = await fetch(API_BASE_URL + "/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("username");
        localStorage.removeItem("user_email");

        guestBox?.classList.remove("hidden");
        loggedBox?.classList.add("hidden");
        logoutBtn?.classList.add("hidden");
        if (nameGuest) nameGuest.textContent = "Guest";
        return;
      }


      if (!res.ok) {
        console.error("Gagal ambil user:", res.status);
        return;
      }

      const data = await res.json(); // { id, name, email }

      if (data?.name) {
        if (nameLogged) nameLogged.textContent = data.name;
        localStorage.setItem("username", data.name);
        localStorage.setItem("user_email", data.email || "");
      }

      // kalau backend nanti punya avatar_url
      if (data?.avatar_url && avatar) {
        avatar.src = data.avatar_url;
      }

      guestBox?.classList.add("hidden");
      logoutBtn?.classList.remove("hidden");
      loggedBox?.classList.remove("hidden");
    } catch (err) {
      console.error("Gagal ambil data user:", err);
    }
  }
});
