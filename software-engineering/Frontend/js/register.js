// ganti dengan endpoint register backend kamu
const API_REGISTER_URL = "http://127.0.0.1:8000/register"; // contoh

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const passwordPlain = passwordInput.value;

    if (!name || !phone || !email || !passwordPlain) {
      alert("Semua field wajib diisi");
      return;
    }

    try {
      // hash password dengan SHA-1 sebelum dikirim
      const hashedPassword = await sha1Hex(passwordPlain);

      console.log("Register - password hashed:", hashedPassword);

      const res = await fetch(API_REGISTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          phone: phone,
          email: email,
          password: hashedPassword,
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error("Register gagal:", res.status, errText);
        alert("Register gagal. Coba cek data yang diisi.");
        return;
      }

      const data = await res.json().catch(() => ({}));
      console.log("Register sukses:", data);

      alert("Register berhasil. Silakan login.");
      window.location.href = "login.html";
    } catch (err) {
      console.error("Error saat register:", err);
      alert("Terjadi kesalahan saat register. Coba lagi.");
    }
  });
});

// fungsi helper - SHA-1 ke hex, sama seperti di login.js
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
