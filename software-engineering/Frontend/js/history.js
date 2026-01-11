// // DUMMY
// document.addEventListener("DOMContentLoaded", () => {
//   const listEl = document.getElementById("history-list");
//   console.log("listEl:", listEl);

//   if (!listEl) return;

//   listEl.innerHTML = `
//     <article class="history-item">
//       <img class="history-img" src="../assets/edukasi-baterai.jpg" />
//       <div class="history-info">
//         <p class="history-title">Baterai</p>
//         <div class="history-date">
//           <span>22 Sep 2025</span>
//         </div>
//       </div>
//     </article>
//   `;
// });


function showLoginModal(message) {
  const modal = document.getElementById("login-modal");
  const subtitle = document.getElementById("login-modal-subtitle");
  const btn = document.getElementById("login-modal-continue");

  if (!modal || !btn) return;

  if (subtitle && message) subtitle.textContent = message;

  modal.classList.remove("hidden");

  btn.onclick = () => {
    localStorage.setItem("redirect_after_login", window.location.href);
    window.location.href = "login.html";
  };
}

function toAbsoluteImageUrl(url) {
  if (!url) return "";

  // kalau sudah absolute (http/https), langsung pakai
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  // kalau url berupa "/static/..." atau "static/..."
  const cleaned = url.startsWith("/") ? url : `/${url}`;
  return API_BASE_URL + cleaned;
}


const API_BASE_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("btn-back");
  const listEl = document.getElementById("history-list");
  const emptyEl = document.getElementById("history-empty");
  const searchEl = document.getElementById("history-search");

  backBtn?.addEventListener("click", () => {
    window.location.href = "./index.html";
  });

  let allItems = [];

  const token = localStorage.getItem("auth_token");

  if (!token) {
    showLoginModal("Silakan login dulu untuk menggunakan fitur history.");
    return;
  }

  loadHistory();


  searchEl?.addEventListener("input", () => {
    const q = (searchEl.value || "").toLowerCase().trim();
    const filtered = allItems.filter((x) =>
      (x.label || "").toLowerCase().includes(q)
    );
    renderHistory(filtered);
  });

  async function loadHistory() {
    try {
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(API_BASE_URL + "/api/history", {
        headers
      });

      if (!res.ok) {
        console.error("Gagal ambil history:", res.status);
        renderHistory([]);
        return;
      }

      const data = await res.json();
      // format yang diharapkan:
      // [{ id, label, created_at, image_url }]
      allItems = Array.isArray(data) ? data : [];
      renderHistory(allItems);
    } catch (err) {
      console.error(err);
      renderHistory([]);
    }
  }

  async function deleteHistory(id) {
    try {
      const res = await fetch(API_BASE_URL + `/api/history/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        showLoginModal("Sesi login habis. Silakan login ulang.");
        return;
      }

      if (!res.ok) {
        console.error("Gagal hapus history:", res.status);
        alert("Gagal menghapus histori. Coba lagi.");
        return;
      }

      // update UI tanpa reload
      allItems = allItems.filter((x) => String(x.id) !== String(id));
      const q = (searchEl?.value || "").toLowerCase().trim();
      const filtered = q
        ? allItems.filter((x) => (x.label || "").toLowerCase().includes(q))
        : allItems;

      renderHistory(filtered);
    } catch (err) {
      console.error(err);
      alert("Koneksi bermasalah. Coba lagi.");
    }
  }


  function renderHistory(items) {
    listEl.innerHTML = "";

    if (!items || items.length === 0) {
      emptyEl.classList.remove("hidden");
      return;
    }
    emptyEl.classList.add("hidden");

    const html = items
      .map((it) => {
        const img = toAbsoluteImageUrl(it.image_url) || "../assets/placeholder.jpg";
        const label = it.label || "Tidak diketahui";
        const dateText = formatDate(it.created_at);

        return `
          <article class="history-item" data-id="${it.id}">
            <img class="history-img" src="${escapeAttr(img)}" alt="${escapeAttr(label)}" />
            <div class="history-info">
              <div class="history-row">
                <p class="history-title">${escapeHtml(label)}</p>

                <button class="history-delete" type="button" title="Hapus" aria-label="Hapus">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>

              <div class="history-date">
                <span class="material-symbols-outlined">calendar_month</span>
                <span>${escapeHtml(dateText)}</span>
              </div>
            </div>
          </article>
        `;

      })
      .join("");

    listEl.innerHTML = html;

    listEl.onclick = async (e) => {
      const btn = e.target.closest(".history-delete");
      if (!btn) return;

      const card = e.target.closest(".history-item");
      const id = card?.dataset?.id;
      if (!id) return;

      const ok = confirm("Hapus histori ini?");
      if (!ok) return;

      await deleteHistory(id);
    };
  }

  function formatDate(iso) {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;

    // format sederhana: 22 Sep 2025
    const months = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = months[d.getMonth()];
    const yy = d.getFullYear();
    return `${dd} ${mm} ${yy}`;
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(str) {
    return escapeHtml(str);
  }
});
