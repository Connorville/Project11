// Data Mock Bawaan
const mockEquipmentData = [
    { id: "ALT-2026-001", name: "Patient Monitor", category: "Monitoring", room: "ICU Utama", status: "Baik", battery: 85, usage: 120 },
    { id: "ALT-2026-002", name: "Ventilator", category: "Terapi & Bantuan Hidup", room: "ICU Ruang 2", status: "Perlu Perbaikan", battery: 40, usage: 350 },
    { id: "ALT-2026-003", name: "ECG Machine", category: "Monitoring", room: "Poli Jantung", status: "Baik", battery: 95, usage: 80 },
    { id: "ALT-2026-004", name: "Infusion Pump", category: "Terapi & Bantuan Hidup", room: "Rawat Inap 3", status: "Baik", battery: 90, usage: 210 },
    { id: "ALT-2026-005", name: "Pulse Oximeter", category: "Monitoring", room: "UGD", status: "Rusak", battery: 15, usage: 500 }
];

function loadEquipmentData() {
    const saved = localStorage.getItem("mediTrack_equipmentData");
    if (saved !== null) {
        return JSON.parse(saved);
    }
    localStorage.setItem("mediTrack_equipmentData", JSON.stringify(mockEquipmentData));
    return mockEquipmentData;
}

function saveEquipmentData(data) {
    localStorage.setItem("mediTrack_equipmentData", JSON.stringify(data));
}

let equipmentData = loadEquipmentData();

document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("equipmentTableBody");
    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");
    const tableInfo = document.getElementById("tableInfo");

    function getStatusClass(status) {
        if (status === "Perlu Perbaikan") return "status-warning";
        if (status === "Rusak") return "status-critical";
        return "status-good";
    }

    // Render Tabel
    function renderTable() {
        if (!tableBody) return;

        const search = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const selectedStatus = statusFilter ? statusFilter.value : "ALL";

        const filtered = equipmentData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(search) ||
                                  item.id.toLowerCase().includes(search) ||
                                  item.room.toLowerCase().includes(search);
            const matchesStatus = (selectedStatus === "ALL") || (item.status === selectedStatus);
            return matchesSearch && matchesStatus;
        });

        tableBody.innerHTML = "";

        if (filtered.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #64748b;">
                        Tidak ada data perangkat yang sesuai.
                    </td>
                </tr>
            `;
        } else {
            filtered.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td><strong>${item.id}</strong></td>
                    <td>${item.name}</td>
                    <td>${item.category || '-'}</td>
                    <td>${item.room}</td>
                    <td><span class="status-badge ${getStatusClass(item.status)}">${item.status}</span></td>
                    <td style="text-align: center;">
                        <button class="btn-action view-btn" data-id="${item.id}" title="Lihat Detail Pop-up">👁</button>
                        <button class="btn-action delete-btn" data-id="${item.id}" title="Hapus Alat">🗑</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }

        if (tableInfo) {
            tableInfo.textContent = `Menampilkan ${filtered.length} dari ${equipmentData.length} alat`;
        }

        // BUKA POP-UP DETAIL
        document.querySelectorAll(".view-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.currentTarget.dataset.id;
                openDetailModal(id);
            });
        });

        // HAPUS ALAT
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.currentTarget.dataset.id;
                if (confirm(`Apakah Anda yakin ingin menghapus perangkat ${id}?`)) {
                    deleteSingleEquipment(id);
                }
            });
        });
    }

    // LOGIKA POP-UP DETAIL
    const detailModal = document.getElementById("detailModal");
    function openDetailModal(id) {
        const item = equipmentData.find(eq => eq.id === id);
        if (!item || !detailModal) return;

        let score = 95;
        if (item.status === "Perlu Perbaikan") score = 65;
        if (item.status === "Rusak") score = 30;

        document.getElementById("dtName").textContent = item.name;
        document.getElementById("dtId").textContent = item.id;
        document.getElementById("dtCategory").textContent = item.category || "-";
        document.getElementById("dtRoom").textContent = item.room || "-";
        
        const statusBadge = document.getElementById("dtStatus");
        statusBadge.textContent = item.status;
        statusBadge.className = `status-badge ${getStatusClass(item.status)}`;

        document.getElementById("dtScore").textContent = `${score}%`;
        document.getElementById("dtBattery").textContent = `${item.battery !== undefined ? item.battery : 85}%`;
        document.getElementById("dtUsage").textContent = `${item.usage !== undefined ? item.usage : 0} jam`;

        detailModal.style.display = "flex";
    }

    const closeDetailModalBtn = document.getElementById("closeDetailModalBtn");
    const cancelDetailModalBtn = document.getElementById("cancelDetailModalBtn");
    const closeDetail = () => { if (detailModal) detailModal.style.display = "none"; };

    if (closeDetailModalBtn) closeDetailModalBtn.onclick = closeDetail;
    if (cancelDetailModalBtn) cancelDetailModalBtn.onclick = closeDetail;

    // HAPUS ALAT
    function deleteSingleEquipment(id) {
        equipmentData = equipmentData.filter(item => item.id !== id);
        saveEquipmentData(equipmentData);
        renderTable();
    }

    // MODAL TAMBAH ALAT
    const equipmentModal = document.getElementById("equipmentModal");
    const addEquipmentBtn = document.getElementById("addEquipmentBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelModalBtn = document.getElementById("cancelModalBtn");
    const equipmentForm = document.getElementById("equipmentForm");

    if (addEquipmentBtn && equipmentModal) {
        addEquipmentBtn.onclick = () => {
            equipmentForm.reset();
            equipmentModal.style.display = "flex";
        };
    }

    const closeModal = () => { if (equipmentModal) equipmentModal.style.display = "none"; };
    if (closeModalBtn) closeModalBtn.onclick = closeModal;
    if (cancelModalBtn) cancelModalBtn.onclick = closeModal;

    if (equipmentForm) {
        equipmentForm.onsubmit = (e) => {
            e.preventDefault();

            const uniqueId = `ALT-2026-${Math.floor(100 + Math.random() * 900)}`;
            const usageValue = document.getElementById("inputUsage").value;

            const newItem = {
                id: uniqueId,
                name: document.getElementById("inputName").value,
                category: document.getElementById("inputCategory").value,
                room: document.getElementById("inputRoom").value,
                status: document.getElementById("inputStatus").value,
                battery: 100,
                usage: usageValue ? parseInt(usageValue, 10) : 0
            };

            equipmentData.unshift(newItem);
            saveEquipmentData(equipmentData);
            renderTable();

            closeModal();
        };
    }

    // Sync profil otomatis dari localStorage
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

    renderTable();
});