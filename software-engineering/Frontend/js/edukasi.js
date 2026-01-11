document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("btn-back-edukasi");

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "./index.html";
    });
  }

  initEduCarousel();
  initEduCards();
});

// CAROUSEL EDUKASI
function initEduCarousel() {
  const track = document.querySelector(".edu-carousel-track");
  const slides = Array.from(document.querySelectorAll(".edu-slide"));
  const dots = Array.from(document.querySelectorAll(".edu-dot"));

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoSlideTimer = null;
  const SLIDE_INTERVAL = 5000;

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    const offset = -index * 100;
    track.style.transform = `translateX(${offset}%)`;

    dots.forEach((dot) => dot.classList.remove("active"));
    const activeDot = dots.find(
      (dot) => Number(dot.dataset.index) === index
    );
    if (activeDot) activeDot.classList.add("active");
  }

  function startAuto() {
    stopAuto();
    autoSlideTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, SLIDE_INTERVAL);
  }

  function stopAuto() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const i = Number(dot.dataset.index);
      goToSlide(i);
      startAuto();
    });
  });

  // swipe
  let startX = 0;
  let dragging = false;

  track.addEventListener("touchstart", (e) => {
    if (!e.touches || e.touches.length === 0) return;
    startX = e.touches[0].clientX;
    dragging = true;
    stopAuto();
  });

  track.addEventListener("touchend", (e) => {
    if (!dragging) return;
    dragging = false;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    const threshold = 50;
    if (diff > threshold) goToSlide(currentIndex - 1);
    else if (diff < -threshold) goToSlide(currentIndex + 1);

    startAuto();
  });

  goToSlide(0);
  startAuto();
}

// TOMBOL "PELAJARI SEKARANG"
function initEduCards() {
  const buttons = document.querySelectorAll(".edu-card-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      if (!target) return;

      window.location.href = `./${target}`;
    });
  });
}
