document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("btn-back");
  if (backBtn) backBtn.addEventListener("click", () => window.history.back());

  initAccordion();
  loadEducationContent();
});

function getCategoryFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return (params.get("cat") || "plastik").toLowerCase();
}

async function loadEducationContent() {
  const cat = getCategoryFromQuery();

  // PILIH SUMBER DATA
  // 1) JSON lokal:
  const DATA_URL = "../assets/data/edukasi.json";

  // 2) kalau mau backend, ganti jadi:
  // const DATA_URL = `http://127.0.0.1:8000/edukasi/${cat}`;

  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`Fetch gagal: ${res.status}`);

    const all = await res.json();
    const data = all[cat] || null;

    if (!data) {
      document.getElementById("edu-title").textContent = "Konten tidak ditemukan";
      return;
    }

    renderEducation(data);
  } catch (err) {
    console.error(err);
    document.getElementById("edu-title").textContent = "Gagal memuat konten";
  }
}

function renderEducation(data) {
  document.getElementById("hero-title").textContent = "Edukasi";
  document.getElementById("edu-title").textContent = data.title || "";
  document.getElementById("edu-summary").textContent = data.summary || "";

  const img = document.getElementById("cover-img");
  if (img) img.src = data.image || "";

  // short preview (ambil kalimat pertama)
  setShort("reduce-short", data.reduce);
  setShort("reuse-short", data.reuse);
  setShort("recycle-short", data.recycle);

  setPanel("panel-reduce", data.reduce);
  setPanel("panel-reuse", data.reuse);
  setPanel("panel-recycle", data.recycle);

  const noteBox = document.getElementById("edu-note");
  const noteText = document.getElementById("edu-note-text");
  if (data.note) {
    noteBox.hidden = false;
    noteText.textContent = data.note;
  } else {
    noteBox.hidden = true;
  }
}

function setShort(id, arr) {
  const el = document.getElementById(id);
  if (!el) return;
  if (!Array.isArray(arr) || arr.length === 0) {
    el.textContent = "";
    return;
  }
  el.textContent = arr[0];
}

function setPanel(panelId, items) {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  if (!Array.isArray(items) || items.length === 0) {
    panel.innerHTML = "<p>Tidak ada data.</p>";
    return;
  }

  const li = items.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
  panel.innerHTML = `<ul>${li}</ul>`;
}

function initAccordion() {
  const cards = document.querySelectorAll(".rrr-card");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.dataset.acc;
      const panel = document.getElementById(`panel-${key}`);
      if (!panel) return;

      // close panel lain
      document.querySelectorAll(".rrr-panel").forEach((p) => {
        if (p !== panel) p.classList.remove("is-open");
      });

      panel.classList.toggle("is-open");
    });
  });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
