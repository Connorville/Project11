document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil ID Alat dari Parameter URL (?id=ALT-2026-001)
    const params = new URLSearchParams(window.location.search);
    const equipmentId = params.get("id");

    // 2. Ambil Data dari LocalStorage
    const savedData = localStorage.getItem("mediTrack_equipmentData");
    const equipmentList = savedData ? JSON.parse(savedData) : [];

    // Cari alat berdasarkan ID
    const item = equipmentList.find(eq => eq.id === equipmentId);

    // 3. Jika Data Tidak Ditemukan
    if (!item) {
        document.getElementById("equipmentName").textContent = "Alat Tidak Ditemukan";
        document.getElementById("conditionTitle").textContent = "Data Tidak Ada";
        document.getElementById("conditionDescription").textContent = "Silakan kembali ke daftar alat dan pilih perangkat yang valid.";
        return;
    }

    // 4. Generate Nilai Default (Baterai, Score, Jam) Jika Belum Ada di Data
    const battery = item.battery !== undefined ? item.battery : 85;
    const usage = item.usage !== undefined ? item.usage : 120;
    
    // Kalkulasi Skor Otomatis Berdasarkan Status
    let score = 95;
    if (item.status === "Perlu Perbaikan") score = 65;
    if (item.status === "Rusak") score = 30;

    // 5. Render Data ke Tampilan
    document.title = `${item.name} | MediTrackPRO`;

    // Header & Breadcrumb
    document.getElementById("breadcrumbName").textContent = item.name;
    document.getElementById("equipmentName").textContent = item.name;
    document.getElementById("equipmentId").textContent = item.id;
    document.getElementById("equipmentType").textContent = item.category || "Medis";

    // Status Badge
    const statusBadge = document.getElementById("equipmentStatus");
    statusBadge.textContent = item.status;
    statusBadge.className = "status-badge"; // Reset class
    if (item.status === "Perlu Perbaikan") statusBadge.classList.add("status-warning");
    if (item.status === "Rusak") statusBadge.classList.add("status-critical");

    // Stat Cards
    document.getElementById("scoreValue").textContent = `${score}%`;
    document.getElementById("batteryValue").textContent = `${battery}%`;
    document.getElementById("usageValue").textContent = `${usage} jam`;
    document.getElementById("roomValue").textContent = item.room || "-";

    // Circular Score & Progress Bar
    document.getElementById("circleScore").textContent = score;
    document.getElementById("scorePercent").textContent = `${score}%`;
    document.getElementById("scoreProgress").style.width = `${score}%`;

    // Descriptions
    const condTitle = document.getElementById("conditionTitle");
    const condDesc = document.getElementById("conditionDescription");

    if (item.status === "Baik") {
        condTitle.textContent = "Kondisi Optimal";
        condDesc.textContent = "Perangkat dalam kondisi siap pakai dan berfungsi sesuai standar operasional.";
    } else if (item.status === "Perlu Perbaikan") {
        condTitle.textContent = "Perlu Perawatan";
        condDesc.textContent = "Perangkat memerlukan perbaikan ringan atau kalibrasi sebelum digunakan kembali.";
    } else {
        condTitle.textContent = "Kondisi Kritis / Rusak";
        condDesc.textContent = "Perangkat mengalami kerusakan dan tidak aman untuk digunakan pada pasien.";
    }

    // Table Information Card
    document.getElementById("infoName").textContent = item.name;
    document.getElementById("infoId").textContent = item.id;
    document.getElementById("infoCategory").textContent = item.category || "Medis";
    document.getElementById("infoRoom").textContent = item.room || "-";
    document.getElementById("infoStatus").textContent = item.status;
    document.getElementById("infoUsage").textContent = `${usage} jam`;

    // Event Kembali
    document.getElementById("backButton").onclick = () => {
        window.location.href = "equipment.html";
    };

    // Responsive Sidebar Mobile
    const menuBtn = document.getElementById("menuButton");
    const sidebar = document.getElementById("sidebar");
    if (menuBtn && sidebar) {
        menuBtn.onclick = () => sidebar.classList.toggle("show");
    }
});