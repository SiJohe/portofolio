// =======================================
// LOAD NAVBAR HTML
// =======================================
document.addEventListener("DOMContentLoaded", async () => {
  const navRoot = document.getElementById("nav-root");
  if (!navRoot) return;

  try {
    // path relatif dari file HTML (index/scan/maps/profile)
    const res = await fetch("./components/navbar.html");
    const html = await res.text();
    navRoot.innerHTML = html;

    // setelah navbar dimasukkan, jalankan fungsinya
    initNavbar();
  } catch (err) {
    console.error("Gagal load navbar.html:", err);
  }

  // fungsi klik menu-card tetap jalan (bukan bagian dari navbar)
  initMenuCards();
});

// =======================================
// INIT NAVBAR SETELAH HTML-NYA MASUK
// =======================================
function initNavbar() {
  const currentPage = document.body.dataset.page; // "Home", "Scan", "Maps", "Profile"
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {
    const label = item.dataset.label;

    // tandai nav active sesuai page
    if (label === currentPage) {
      item.classList.add("is-active");
    }

    // klik nav → pindah halaman
    item.addEventListener("click", () => {
      navItems.forEach(i => i.classList.remove("is-active"));
      item.classList.add("is-active");

      if (label === "Home") window.location.href = "./index.html";
      if (label === "Scan") window.location.href = "./scan.html";
      if (label === "Maps") window.location.href = "./maps.html";
      if (label === "Profile") window.location.href = "./profile.html";
    });
  });
}

// =======================================
// MENU CARD (EDUKASI / SCAN / NOTIF / HISTORY)
// =======================================
function initMenuCards() {
  const menuCards = document.querySelectorAll(".menu-card");
  
  menuCards.forEach((card) => {
    card.addEventListener("click", () => {
      const target = card.dataset.target;
      if (target) {
        // arahkan ke page target
        window.location.href = `./${target}`;
      }
    });
  });
}
