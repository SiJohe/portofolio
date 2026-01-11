// ganti dengan endpoint backend kamu
const API_LOGIN_URL = "http://127.0.0.1:8000/login"; // contoh

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const forgotBtn = document.getElementById("btn-forgot");

  if (forgotBtn) {
    forgotBtn.addEventListener("click", () => {
      // misal arahkan ke page forgot-password, nanti bisa kamu buat
      window.location.href = "login.html";
    });
  }

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const passwordPlain = passwordInput.value;

    if (!email || !passwordPlain) {
      alert("Email dan password wajib diisi");
      return;
    }

    try {
      // hash password dengan SHA-1
      const hashedPassword = await sha1Hex(passwordPlain);

      console.log("Password hashed:", hashedPassword);

      // kirim ke backend
      const res = await fetch(API_LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: hashedPassword,
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error("Login gagal:", res.status, errText);
        alert("Login gagal. Periksa email dan password.");
        return;
      }

      const data = await res.json().catch(() => ({}));
      console.log("Login sukses:", data);

      // contoh: kalau backend mengembalikan token dan nama
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }
      if (data.name) {
        localStorage.setItem("username", data.name);
      }

      // redirect ke home
      window.location.href = "index.html";
    } catch (err) {
      console.error("Error saat login:", err);
      alert("Terjadi kesalahan saat login. Coba lagi.");
    }
  });
});

// fungsi helper - convert string ke SHA-1 hex menggunakan Web Crypto
async function sha1Hex(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}



const backBtn = document.getElementById("btn-back-login");

backBtn?.addEventListener("click", () => {
  window.location.href = "index.html";
});
