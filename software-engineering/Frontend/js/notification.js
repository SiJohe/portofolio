const API_BASE_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("btn-back");
  const permStatus = document.getElementById("perm-status");
  const saveStatus = document.getElementById("save-status");

  const toggleEnabled = document.getElementById("toggle-enabled");
  const btnPermission = document.getElementById("btn-permission");

  const timeInput = document.getElementById("reminder-time");
  const typeSelect = document.getElementById("reminder-type");
  const msgInput = document.getElementById("reminder-message");

  const btnSave = document.getElementById("btn-save");
  const btnTest = document.getElementById("btn-test");

  // back
  backBtn?.addEventListener("click", () => {
    window.location.href = "./profile.html";
  });

  // days toggle
  const dayBtns = Array.from(document.querySelectorAll(".day-btn"));
  dayBtns.forEach((b) => {
    b.addEventListener("click", () => b.classList.toggle("is-active"));
  });

  // permission status
  updatePermissionText();

  btnPermission?.addEventListener("click", async () => {
    if (!("Notification" in window)) {
      permStatus.textContent = "Browser tidak mendukung Notification.";
      return;
    }
    try {
      const result = await Notification.requestPermission();
      permStatus.textContent = `Status izin: ${result}`;
    } catch (e) {
      permStatus.textContent = "Gagal meminta izin notifikasi.";
    }
  });

  // test
  btnTest?.addEventListener("click", async () => {
    const ok = await ensurePermission();
    if (!ok) return;

    new Notification("Eco Cycle", {
      body: msgInput?.value?.trim() || "Ini contoh notifikasi pengingat.",
    });
  });

  // save
  btnSave?.addEventListener("click", async () => {
    const payload = collectSettings(dayBtns, toggleEnabled, timeInput, typeSelect, msgInput);

    if (payload.enabled) {
      const ok = await ensurePermission();
      if (!ok) return;
    }

    try {
      saveStatus.textContent = "Menyimpan...";
      const res = await fetch(API_BASE_URL + "/api/notifications/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("Gagal simpan:", res.status, txt);
        saveStatus.textContent = "Gagal menyimpan setting.";
        return;
      }

      // simpan juga di localStorage sebagai fallback UI
      localStorage.setItem("notifSettings", JSON.stringify(payload));
      saveStatus.textContent = "Setting berhasil disimpan.";
    } catch (err) {
      console.error(err);
      saveStatus.textContent = "Error koneksi saat menyimpan.";
    }
  });

  // load fallback setting dari localStorage (opsional)
  loadFromLocal(dayBtns, toggleEnabled, timeInput, typeSelect, msgInput);

  function updatePermissionText() {
    if (!("Notification" in window)) {
      permStatus.textContent = "Status izin: tidak didukung browser";
      return;
    }
    permStatus.textContent = `Status izin: ${Notification.permission}`;
  }

  async function ensurePermission() {
    if (!("Notification" in window)) {
      permStatus.textContent = "Browser tidak mendukung Notification.";
      return false;
    }

    if (Notification.permission === "granted") {
      updatePermissionText();
      return true;
    }

    if (Notification.permission === "denied") {
      permStatus.textContent = "Izin ditolak. Aktifkan dari setting browser.";
      return false;
    }

    const result = await Notification.requestPermission();
    updatePermissionText();
    return result === "granted";
  }
});

function collectSettings(dayBtns, toggleEnabled, timeInput, typeSelect, msgInput) {
  const days = dayBtns
    .filter((b) => b.classList.contains("is-active"))
    .map((b) => b.dataset.day);

  return {
    enabled: !!toggleEnabled?.checked,
    time: timeInput?.value || "20:00",
    days,
    type: typeSelect?.value || "sort_waste",
    message: (msgInput?.value || "").trim(),
  };
}

function loadFromLocal(dayBtns, toggleEnabled, timeInput, typeSelect, msgInput) {
  const raw = localStorage.getItem("notifSettings");
  if (!raw) return;

  try {
    const data = JSON.parse(raw);

    if (toggleEnabled) toggleEnabled.checked = !!data.enabled;
    if (timeInput && data.time) timeInput.value = data.time;
    if (typeSelect && data.type) typeSelect.value = data.type;
    if (msgInput && data.message) msgInput.value = data.message;

    if (Array.isArray(data.days)) {
      dayBtns.forEach((b) => {
        b.classList.toggle("is-active", data.days.includes(b.dataset.day));
      });
    }
  } catch {}
}
