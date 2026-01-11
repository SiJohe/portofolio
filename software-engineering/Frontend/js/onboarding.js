const ONBOARDING_KEY = "onboarding_done";
const HOME_PAGE = "./index.html";

document.addEventListener("DOMContentLoaded", () => {
  // kalau sudah pernah onboarding, langsung ke home
  if (sessionStorage.getItem(ONBOARDING_KEY) === "1") {
    window.location.href = HOME_PAGE;
    return
  }

  const slides = Array.from(document.querySelectorAll(".ob-slide"));
  const dots = Array.from(document.querySelectorAll(".ob-dot"));
  const btnNext = document.getElementById("btn-next");
  const btnSkip = document.getElementById("btn-skip");

  let idx = 0;

  function render() {
    slides.forEach((s, i) => s.classList.toggle("is-active", i === idx));
    dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));

    // slide terakhir: tombol jadi "Start"
    if (idx === slides.length - 1) {
      btnNext.textContent = "Start";
    } else {
      btnNext.textContent = "Next";
    }
  }

  function finish() {
    sessionStorage.setItem(ONBOARDING_KEY, "1");
    window.location.href = HOME_PAGE;
  }

  btnNext?.addEventListener("click", () => {
    if (idx < slides.length - 1) {
      idx += 1;
      render();
    } else {
      finish();
    }
  });

  btnSkip?.addEventListener("click", () => {
    finish();
  });

  // swipe (geser kiri kanan)
  let startX = 0;
  let endX = 0;

  const slider = document.getElementById("ob-slider");
  slider?.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  slider?.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (Math.abs(diff) < 40) return;

    if (diff < 0 && idx < slides.length - 1) {
      idx += 1;
      render();
    }

    if (diff > 0 && idx > 0) {
      idx -= 1;
      render();
    }
  });

  render();
});
