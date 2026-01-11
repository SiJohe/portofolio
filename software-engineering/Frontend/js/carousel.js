if (localStorage.getItem("onboarding_done") !== "1") {
  window.location.href = "./onboarding.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const slides = Array.from(document.querySelectorAll(".stats-card"));
  const dots = Array.from(document.querySelectorAll(".carousel-dots .dot"));

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoSlideTimer = null;
  const SLIDE_INTERVAL = 5000; // 5 detik

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    const offset = -index * 100; // persen
    track.style.transform = `translateX(${offset}%)`;

    dots.forEach((dot) => dot.classList.remove("active"));
    const activeDot = dots.find((dot) => Number(dot.dataset.index) === index);
    if (activeDot) activeDot.classList.add("active");
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, SLIDE_INTERVAL);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  // klik dots
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = Number(dot.dataset.index);
      goToSlide(index);
      startAutoSlide();
    });
  });

  // swipe gesture (untuk HP)
  let startX = 0;
  let isDragging = false;

  track.addEventListener("touchstart", (e) => {
    if (!e.touches || e.touches.length === 0) return;
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoSlide();
  });

  track.addEventListener("touchmove", (e) => {
    if (!isDragging || !e.touches || e.touches.length === 0) return;
    // optional: bisa ditambah efek drag realtime
  });

  track.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;

    const threshold = 50; // minimal geser 50px
    if (diffX > threshold) {
      // geser ke kanan - slide sebelumnya
      goToSlide(currentIndex - 1);
    } else if (diffX < -threshold) {
      // geser ke kiri - slide berikutnya
      goToSlide(currentIndex + 1);
    }

    startAutoSlide();
  });

  // inisialisasi
  goToSlide(0);
  startAutoSlide();
});
