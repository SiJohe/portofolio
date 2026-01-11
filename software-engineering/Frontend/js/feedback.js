const API_BASE_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("btn-back");
  const form = document.getElementById("feedback-form");
  const nameInput = document.getElementById("fb-name");
  const msgInput = document.getElementById("fb-message");
  const ratingInput = document.getElementById("fb-rating");
  const statusEl = document.getElementById("fb-status");
  const submitBtn = document.getElementById("fb-submit");

  // back
  backBtn?.addEventListener("click", () => {
    window.location.href = "./profile.html";
  });

  // rating stars
  const stars = Array.from(document.querySelectorAll(".fb-star"));
  let currentRating = 0;

  function paintStars(value) {
    stars.forEach((s) => {
      const v = Number(s.dataset.value);
      s.classList.toggle("is-active", v <= value);
    });
  }

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      currentRating = Number(star.dataset.value);
      ratingInput.value = String(currentRating);
      paintStars(currentRating);
    });
  });

  // submit
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: (nameInput?.value || "").trim(),
      rating: Number(ratingInput?.value || 0),
      message: (msgInput?.value || "").trim(),
      created_at: new Date().toISOString(),
    };

    // validasi minimal
    if (!payload.message) {
      statusEl.textContent = "Tolong isi feedback terlebih dahulu.";
      return;
    }
    if (payload.rating <= 0) {
      statusEl.textContent = "Tolong pilih rating bintang.";
      return;
    }

    try {
      submitBtn.disabled = true;
      statusEl.textContent = "Mengirim...";

      const res = await fetch(API_BASE_URL + "/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("Submit feedback gagal:", res.status, txt);
        statusEl.textContent = "Gagal mengirim. Coba lagi.";
        submitBtn.disabled = false;
        return;
      }

      statusEl.textContent = "Terima kasih! Feedback berhasil dikirim.";
      form.reset();
      currentRating = 0;
      ratingInput.value = "0";
      paintStars(0);
    } catch (err) {
      console.error(err);
      statusEl.textContent = "Error koneksi. Coba lagi.";
    } finally {
      submitBtn.disabled = false;
    }
  });
});
