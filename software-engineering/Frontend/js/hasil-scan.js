// DEBUG
// if (!localStorage.getItem("scanResult")) {
//   localStorage.setItem("scanResult", JSON.stringify({
//     image: "/assets/edukasi-plastik.webp",
//     label: "Plastik",
//     description: "Sampah plastik adalah sampah yang berasal dari bahan polimer."
//   }));
// }



document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("btn-back");
  const imgEl = document.getElementById("result-image");
  const labelEl = document.getElementById("result-label");
  const descEl = document.getElementById("result-description");
  const detailBtn = document.getElementById("btn-detail");

  // ambil data dari localStorage
  const raw = localStorage.getItem("scanResult");
  if (!raw) {
    // kalau tidak ada data, balik ke halaman scan
    window.location.href = "./scan.html";
    return;
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error("Gagal parse scanResult:", err);
    window.location.href = "./scan.html";
    return;
  }

  const imageUrl = data.image;
  const label = data.label || "Tidak diketahui";
  const description =
    data.description ||
    `Sampah ini diprediksi sebagai kategori ${label}.`;

  // tampilkan di UI
  if (imgEl && imageUrl) {
    imgEl.src = imageUrl;
  }
  if (labelEl) {
    labelEl.textContent = label;
  }
  if (descEl) {
    descEl.textContent = description;
  }

  // tombol back
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "./scan.html";
    });
  }

  // tombol Detail ke edukasi-[kategori].html
  if (detailBtn) {
    detailBtn.addEventListener("click", () => {
      // ubah label ke slug: "Sampah Plastik" -> "plastik"
      const slug = label
        .toString()
        .toLowerCase()
        .replace(/sampah/g, "")   // buang kata "sampah" jika ada
        .trim()
        .replace(/\s+/g, "-");    // spasi jadi -

      const target = `edukasi-detail.html?cat=${slug}`;
      window.location.href = `./${target}`;
    });
  }
});
