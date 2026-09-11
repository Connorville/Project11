document.addEventListener("DOMContentLoaded", () => {
    syncSidebarProfile();

    const mockEquipmentData = [
        { id: "ALT-2026-001", name: "Patient Monitor", category: "Monitoring", room: "ICU Utama", status: "Baik" },
        { id: "ALT-2026-002", name: "Ventilator", category: "Terapi & Bantuan Hidup", room: "ICU Ruang 2", status: "Perlu Perbaikan" },
        { id: "ALT-2026-003", name: "ECG Machine", category: "Monitoring", room: "Poli Jantung", status: "Baik" },
        { id: "ALT-2026-004", name: "Infusion Pump", category: "Terapi & Bantuan Hidup", room: "Rawat Inap 3", status: "Baik" },
        { id: "ALT-2026-005", name: "Pulse Oximeter", category: "Monitoring", room: "UGD", status: "Rusak" }
    ];

    function getEquipmentData() {
        const saved = localStorage.getItem("mediTrack_equipmentData");
        if (saved !== null) {
            return JSON.parse(saved);
        }
        localStorage.setItem("mediTrack_equipmentData", JSON.stringify(mockEquipmentData));
        return mockEquipmentData;
    }

    function renderDashboard() {
        const equipmentData = getEquipmentData();

        // Update Kartu Statistik Ringkasan
        const elTotal = document.getElementById("dashTotal") || document.getElementById("dashTotalEq");
        const elGood = document.getElementById("dashGood") || document.getElementById("dashGoodEq");
        const elWarn = document.getElementById("dashWarn") || document.getElementById("dashWarnEq");
        const elDanger = document.getElementById("dashDanger") || document.getElementById("dashDangerEq");

        if (elTotal) elTotal.textContent = equipmentData.length;
        if (elGood) elGood.textContent = equipmentData.filter(i => i.status === "Baik").length;
        if (elWarn) elWarn.textContent = equipmentData.filter(i => i.status === "Perlu Perbaikan").length;
        if (elDanger) elDanger.textContent = equipmentData.filter(i => i.status === "Rusak").length;

        // Render Tabel Aktivitas Ringkas
        const tableBody = document.getElementById("dashboardTableBody") || document.getElementById("dashEquipmentTable");
        if (!tableBody) return;
        
        tableBody.innerHTML = "";

        const recentItems = [...equipmentData].reverse().slice(0, 5);

        recentItems.forEach(item => {
            let statusClass = "status-good";
            if (item.status === "Perlu Perbaikan") statusClass = "status-warning";
            if (item.status === "Rusak") statusClass = "status-critical";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td><strong>${item.id}</strong></td>
                <td>${item.name}</td>
                <td>${item.room}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
            `;
            tableBody.appendChild(row);
        });
    }

    renderDashboard();
});

function syncSidebarProfile() {
    const savedProfile = localStorage.getItem("mediTrack_profile");
    if (!savedProfile) return;

    try {
        const profile = JSON.parse(savedProfile);
        const sidebarName = document.getElementById("sidebarName");
        const sidebarRole = document.getElementById("sidebarRole");
        const sidebarAvatar = document.getElementById("sidebarAvatar");
        const topAvatar = document.getElementById("topAvatar");

        if (sidebarName && profile.name) sidebarName.textContent = profile.name;
        if (sidebarRole && profile.role) sidebarRole.textContent = profile.role;

        if (profile.name) {
            const initial = profile.name.trim().charAt(0).toUpperCase();
            if (sidebarAvatar) sidebarAvatar.textContent = initial;
            if (topAvatar) topAvatar.textContent = initial;
        }
    } catch (e) {
        console.error("Gagal memuat profil:", e);
    }
}