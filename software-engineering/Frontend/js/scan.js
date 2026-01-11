// Helper
function redirectToLogin() {
  localStorage.setItem("redirect_after_login", window.location.href);
  window.location.href = "login.html";
}

// ganti dengan alamat backend kamu
const API_PREDICT_URL = "http://127.0.0.1:8000/predict";
const RESULT_PAGE = "hasil-scan.html"; // halaman tujuan setelah Continue

document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("btn-back");
  const video = document.getElementById("camera-preview");
  const image = document.getElementById("image-preview");
  const captureBtn = document.getElementById("btn-capture");
  const galleryBtn = document.getElementById("btn-gallery");
  const fileInput = document.getElementById("file-input");
  const mapsBtn = document.getElementById("btn-maps");

  const modal = document.getElementById("result-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalSubtitle = document.getElementById("modal-subtitle");
  const modalContinue = document.getElementById("modal-continue");

  function setContinueEnabled(enabled) {
    if (!modalContinue) return;
    modalContinue.disabled = !enabled;
    modalContinue.style.opacity = enabled ? "1" : "0.5";
  }

  let stream = null;
  let lastPredictSuccess = false;
  setContinueEnabled(false);

  backBtn?.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  mapsBtn?.addEventListener("click", () => {
    window.location.href = "maps.html";
  });

  captureBtn?.addEventListener("click", () => {
    captureAndPredict();
  });

  galleryBtn?.addEventListener("click", () => {
    fileInput?.click();
  });

  fileInput?.addEventListener("change", async () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;

    const dataUrl = await readFileAsDataURL(file);
    await sendImageToBackend(file, dataUrl);

    showPreview(dataUrl);
  });

  modalContinue?.addEventListener("click", () => {
    modal?.classList.add("hidden");

    // hanya lanjut jika prediksi sukses
    if (!lastPredictSuccess) return;

    window.location.href = RESULT_PAGE;
  });

  startCamera();

  window.addEventListener("beforeunload", () => {
    stopCamera();
  });

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      console.warn("Camera tidak didukung di browser ini.");
      return;
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      if (video) {
        video.srcObject = stream;
        video.classList.remove("hidden");
      }
      image?.classList.add("hidden");
    } catch (err) {
      console.error("Gagal akses kamera:", err);
    }
  }

  function stopCamera() {
    if (!stream) return;
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
  }

  async function captureAndPredict() {
    if (!video || video.readyState < 2) {
      console.warn("Video belum siap, tidak bisa capture.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.9)
    );

    if (!blob) return;

    await sendImageToBackend(blob, dataUrl);
    showPreview(dataUrl);
  }

  function showPreview(dataUrl) {
    if (image) {
      image.src = dataUrl;
      image.classList.remove("hidden");
    }
    video?.classList.add("hidden");
  }

  function saveScanResult(imageDataUrl, label, description) {
    const payload = { image: imageDataUrl, label, description };
    localStorage.setItem("scanResult", JSON.stringify(payload));
  }

  function clearScanResult() {
    localStorage.removeItem("scanResult");
  }

  function showResultModal(title, subtitle) {
    if (!modal || !modalTitle || !modalSubtitle) return;
    modalTitle.textContent = title;
    modalSubtitle.textContent = subtitle;
    modal.classList.remove("hidden");
  }

  async function sendImageToBackend(fileBlobOrFile, previewDataUrl) {
    lastPredictSuccess = false;
    setContinueEnabled(false);
    clearScanResult();

    const token = localStorage.getItem("auth_token");
    if (!token) {
      showResultModal("Harus login", "Silakan login dulu untuk menggunakan fitur scan.");
      setTimeout(() => {
        redirectToLogin();
      }, 1200);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", fileBlobOrFile, "upload.jpg");

      const res = await fetch(API_PREDICT_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        // 401 biasanya karena token invalid / belum login
        if (res.status === 401) {
          showResultModal("Harus login", "Silakan login untuk melanjutkan.");
          setTimeout(() => {
            redirectToLogin();
          }, 1200);
          return;
        } else {
          showResultModal("Terjadi kesalahan", "Silakan coba lagi.");
        }
        console.error("Gagal prediksi:", res.status);
        return;
      }

      const data = await res.json();
      const label = data.label || "Tidak diketahui";
      const description =
        data.description || `Sampah ini diprediksi sebagai kategori ${label}.`;

      if (previewDataUrl) {
        saveScanResult(previewDataUrl, label, description);
      }

      lastPredictSuccess = true;
      setContinueEnabled(true);
      showResultModal(`Sampah tersebut merupakan sampah ${label}`, "Lihat detailnya");
    } catch (err) {
      console.error("Error kirim ke backend:", err);
      showResultModal("Terjadi kesalahan", "Periksa koneksi dan coba lagi.");
    }
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
});