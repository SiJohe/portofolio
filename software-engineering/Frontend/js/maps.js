// ===================================================
// CONFIG
// ===================================================
const API_BASE_URL = "http://127.0.0.1:8000";
const API_LOCATIONS_URL = API_BASE_URL + "/api/locations";

// ubah ke 1 kalau debug (pakai dummy), 0 kalau pakai backend
const DEBUG_MODE = 1;

// fokus awal peta (BINUS Anggrek)
const BINUS_ANGGREK = { lat: -6.20177, lng: 106.78298 };
const DEFAULT_ZOOM = 16;

// ===================================================
// DUMMY DATA (DEBUG)
// ===================================================
const DUMMY_LOCATIONS = [
  {
    id: 1,
    name: "Bak Sampah Anggrek A",
    accepts: ["Organik", "Plastik", "Kaca"],
    address: "BINUS Anggrek, Kemanggisan",
    hours: "08:00 - 17:00",
    lat: -6.20155,
    lng: 106.78325,
  },
  {
    id: 2,
    name: "Bak Sampah Anggrek B",
    accepts: ["Plastik", "Kertas"],
    address: "BINUS Anggrek, dekat lobby",
    hours: "08:00 - 17:00",
    lat: -6.20205,
    lng: 106.78260,
  },
  {
    id: 3,
    name: "Drop Point Kemanggisan",
    accepts: ["Organik", "Plastik", "Kaca"],
    address: "Jl. Kemanggisan Ilir",
    hours: "09:00 - 16:00",
    lat: -6.20095,
    lng: 106.78410,
  },
];

// ===================================================
// MAIN
// ===================================================
document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("btn-back");
  const listEl = document.getElementById("maps-list");
  const emptyEl = document.getElementById("maps-empty");
  const searchEl = document.getElementById("maps-search");
  const myLocBtn = document.getElementById("btn-my-location");

  backBtn?.addEventListener("click", () => {
    window.location.href = "./index.html";
  });

  // =============================
  // INIT MAP
  // =============================
  const map = L.map("map", { zoomControl: false }).setView(
    [BINUS_ANGGREK.lat, BINUS_ANGGREK.lng],
    DEFAULT_ZOOM
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map);

  const markers = new Map();
  let allLocations = [];

  initLocations();

  // =============================
  // SEARCH
  // =============================
  searchEl?.addEventListener("input", () => {
    const q = (searchEl.value || "").toLowerCase().trim();

    const filtered = allLocations.filter((x) => {
      const hay = `${x.name} ${x.address} ${(x.accepts || []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });

    renderLocations(filtered);
  });

  // =============================
  // MY LOCATION
  // =============================
  myLocBtn?.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 16);

        L.circleMarker([latitude, longitude], {
          radius: 8,
          color: "#2563eb",
          fillColor: "#2563eb",
          fillOpacity: 0.9,
        })
          .addTo(map)
          .bindPopup("Lokasi kamu")
          .openPopup();
      },
      () => alert("Gagal mengambil lokasi device.")
    );
  });

  // ===================================================
  // DATA LOADER
  // ===================================================
  async function initLocations() {
    if (DEBUG_MODE === 1) {
      allLocations = DUMMY_LOCATIONS;
      refreshUI(allLocations);
      return;
    }

    try {
      const res = await fetch(API_LOCATIONS_URL, { credentials: "include" });
      if (!res.ok) throw new Error("HTTP " + res.status);

      const data = await res.json();
      allLocations = Array.isArray(data) && data.length ? data : DUMMY_LOCATIONS;
      refreshUI(allLocations);
    } catch (err) {
      console.warn("Fetch lokasi gagal, pakai dummy:", err);
      allLocations = DUMMY_LOCATIONS;
      refreshUI(allLocations);
    }
  }

  // ===================================================
  // UI RENDER
  // ===================================================
  function refreshUI(items) {
    clearMarkers();
    renderLocations(items);
    items.forEach(addMarker);
  }

  function clearMarkers() {
    markers.forEach((m) => map.removeLayer(m));
    markers.clear();
  }

  function addMarker(loc) {
    const m = L.marker([loc.lat, loc.lng]).addTo(map);
    m.bindPopup(`<b>${escapeHtml(loc.name)}</b><br>${escapeHtml(loc.address)}`);
    markers.set(loc.id, m);
  }

  function renderLocations(items) {
    listEl.innerHTML = "";

    if (!items || items.length === 0) {
      emptyEl.classList.remove("hidden");
      return;
    }
    emptyEl.classList.add("hidden");

    listEl.innerHTML = items.map((loc) => `
      <article class="loc-card">
        <div class="loc-left">
          <div class="loc-icon">
            <span class="material-symbols-outlined">delete</span>
          </div>

          <div class="loc-text">
            <p class="loc-title">${escapeHtml((loc.accepts || []).join(", "))}</p>

            <div class="loc-meta">
              <div class="loc-meta-row">
                <span class="material-symbols-outlined">location_on</span>
                <span>${escapeHtml(loc.address)}</span>
              </div>
              <div class="loc-meta-row">
                <span class="material-symbols-outlined">schedule</span>
                <span>${escapeHtml(loc.hours)}</span>
              </div>
            </div>
          </div>
        </div>

        <button class="loc-btn" data-id="${loc.id}">Lihat Lokasi</button>
      </article>
    `).join("");

    listEl.querySelectorAll(".loc-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        const loc = allLocations.find((x) => x.id === id);
        if (!loc) return;

        map.setView([loc.lat, loc.lng], 18);
        markers.get(id)?.openPopup();
      });
    });
  }

  // ===================================================
  // UTILS
  // ===================================================
  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
});
