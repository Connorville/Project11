// Data Default jika localStorage belum terisi
const defaultEquipmentData = [
    { id: "ALT-2026-001", name: "Patient Monitor", category: "Diagnostik", room: "ICU Utama", status: "Baik" },
    { id: "ALT-2026-002", name: "Ventilator", category: "Pendukung Kehidupan", room: "ICU Ruang 2", status: "Perlu Perbaikan" },
    { id: "ALT-2026-003", name: "ECG Machine", category: "Diagnostik", room: "Poli Jantung", status: "Baik" },
    { id: "ALT-2026-004", name: "Infusion Pump", category: "Pendukung Kehidupan", room: "Rawat Inap 3", status: "Baik" },
    { id: "ALT-2026-005", name: "Pulse Oximeter", category: "Diagnostik", room: "UGD", status: "Rusak" }
];

function getEquipmentData() {
    const saved = localStorage.getItem("mediTrack_equipmentData");
    if (saved !== null) {
        return JSON.parse(saved);
    }
    localStorage.setItem("mediTrack_equipmentData", JSON.stringify(defaultEquipmentData));
    return defaultEquipmentData;
}

function saveEquipmentData(data) {
    localStorage.setItem("mediTrack_equipmentData", JSON.stringify(data));
}

document.addEventListener("DOMContentLoaded", () => {
    let equipmentData = getEquipmentData();
    let activeMaintId = null;

    const table = document.getElementById("maintenanceTable");
    const emptyState = document.getElementById("maintEmptyState");
    const resultCount = document.getElementById("maintResultCount");
    const maintModal = document.getElementById("maintModal");

    // Menampilkan hanya alat bernilai "Perlu Perbaikan" atau "Rusak"
    function renderMaintenanceTable() {
        equipmentData = getEquipmentData();

        const maintenanceItems = equipmentData.filter(
            item => item.status === "Perlu Perbaikan" || item.status === "Rusak"
        );

        // Update ringkasan kartu
        const warnCount = maintenanceItems.filter(i => i.status === "Perlu Perbaikan").length;
        const dangerCount = maintenanceItems.filter(i => i.status === "Rusak").length;

        if (document.getElementById("maintWarnCount")) document.getElementById("maintWarnCount").textContent = warnCount;
        if (document.getElementById("maintDangerCount")) document.getElementById("maintDangerCount").textContent = dangerCount;
        if (document.getElementById("maintTotalCount")) document.getElementById("maintTotalCount").textContent = maintenanceItems.length;

        if (resultCount) resultCount.textContent = `${maintenanceItems.length} alat`;

        table.innerHTML = "";

        if (maintenanceItems.length === 0) {
            if (emptyState) emptyState.style.display = "block";
            return;
        } else {
            if (emptyState) emptyState.style.display = "none";
        }

        maintenanceItems.forEach(item => {
            let statusClass = item.status === "Perlu Perbaikan" ? "status-warning" : "status-danger";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.id}</td>
                <td><strong>${item.name}</strong></td>
                <td>${item.room}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
                <td>
                    <button class="btn-action view-btn edit-maint-btn" data-id="${item.id}">Update Status</button>
                </td>
            `;
            table.appendChild(row);
        });

        document.querySelectorAll(".edit-maint-btn").forEach(btn => {
            btn.addEventListener("click", (e) => openMaintModal(e.target.dataset.id));
        });
    }

    // Modal Buka & Edit Status
    function openMaintModal(id) {
        const item = equipmentData.find(eq => eq.id === id);
        if (!item) return;

        activeMaintId = id;
        document.getElementById("maintDtId").textContent = item.id;
        document.getElementById("maintDtName").textContent = item.name;
        document.getElementById("maintDtRoom").textContent = item.room;
        document.getElementById("maintStatusSelect").value = item.status;

        maintModal.style.display = "flex";
    }

    // Simpan Perubahan Status
    const saveBtn = document.getElementById("saveMaintStatusBtn");
    if (saveBtn) {
        saveBtn.onclick = () => {
            if (!activeMaintId) return;

            const newStatus = document.getElementById("maintStatusSelect").value;
            const targetItem = equipmentData.find(item => item.id === activeMaintId);

            if (targetItem) {
                targetItem.status = newStatus;
                saveEquipmentData(equipmentData);
                renderMaintenanceTable(); // Jika diubah jadi 'Baik', otomatis hilang dari tabel
                maintModal.style.display = "none";
            }
        };
    }

    // Event Tutup Modal
    if (document.getElementById("closeMaintModal")) {
        document.getElementById("closeMaintModal").onclick = () => maintModal.style.display = "none";
    }
    if (document.getElementById("cancelMaintModal")) {
        document.getElementById("cancelMaintModal").onclick = () => maintModal.style.display = "none";
    }

    renderMaintenanceTable();
});