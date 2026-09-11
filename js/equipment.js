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
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Data JSON rusak, memuat data default...", e);
        }
    }
    localStorage.setItem("mediTrack_equipmentData", JSON.stringify(mockEquipmentData));
    return mockEquipmentData;
}

function saveEquipmentData(data) {
    localStorage.setItem("mediTrack_equipmentData", JSON.stringify(data));
}

let equipmentData = loadEquipmentData();

document.addEventListener("DOMContentLoaded", () => {
    syncSidebarProfile();

    const tableBody = document.getElementById("equipmentTableBody");
    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");
    const tableInfo = document.getElementById("tableInfo");

    const mntModal = document.getElementById("maintenanceTicketModal");
    const mntForm = document.getElementById("maintenanceTicketForm");
    const closeMntBtn = document.getElementById("closeMntModalBtn");
    const cancelMntBtn = document.getElementById("cancelMntModalBtn");

    function getStatusClass(status) {
        if (status === "Perlu Perbaikan") return "status-warning";
        if (status === "Rusak") return "status-critical";
        return "status-good";
    }

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
                    <td>
                        <select class="status-select-inline ${getStatusClass(item.status)}" data-id="${item.id}" style="padding: 4px 8px; border-radius: 6px; font-weight: 600; cursor: pointer; outline: none; border: 1px solid var(--border-color);">
                            <option value="Baik" ${item.status === "Baik" ? "selected" : ""}>Baik</option>
                            <option value="Perlu Perbaikan" ${item.status === "Perlu Perbaikan" ? "selected" : ""}>Perlu Perbaikan</option>
                            <option value="Rusak" ${item.status === "Rusak" ? "selected" : ""}>Rusak</option>
                        </select>
                    </td>
                    <td style="text-align: center;">
                        <button class="btn-action delete-btn" data-id="${item.id}" title="Hapus Alat" style="padding: 6px 10px; cursor: pointer; background: #ef4444; color: white; border: none; border-radius: 6px; font-weight: bold;">🗑</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }

        if (tableInfo) {
            tableInfo.textContent = `Menampilkan ${filtered.length} dari ${equipmentData.length} alat`;
        }

        // EVENT UBAH STATUS INLINE
        document.querySelectorAll(".status-select-inline").forEach(select => {
            select.addEventListener("change", (e) => {
                const id = e.target.dataset.id;
                const newStatus = e.target.value;
                updateEquipmentStatus(id, newStatus);
            });
        });

        // EVENT HAPUS ALAT (Menggunakan closest agar deteksi e.target akurat)
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const targetBtn = e.target.closest(".delete-btn");
                if (targetBtn) {
                    const id = targetBtn.dataset.id;
                    if (confirm(`Apakah Anda yakin ingin menghapus perangkat ${id}?`)) {
                        deleteSingleEquipment(id);
                    }
                }
            });
        });
    }

    function updateEquipmentStatus(id, newStatus) {
        const item = equipmentData.find(eq => eq.id === id);
        if (!item) return;

        const oldStatus = item.status;
        item.status = newStatus;
        saveEquipmentData(equipmentData);

        if ((newStatus === "Perlu Perbaikan" || newStatus === "Rusak") && oldStatus === "Baik") {
            openMaintenanceModal(item);
        }

        renderTable();
    }

    function deleteSingleEquipment(id) {
        equipmentData = equipmentData.filter(item => item.id !== id);
        saveEquipmentData(equipmentData);
        renderTable();
    }

    function openMaintenanceModal(item) {
        document.getElementById("mntEqId").value = item.id;
        document.getElementById("mntEqName").value = item.name;
        document.getElementById("mntEqRoom").value = item.room;
        document.getElementById("mntPriority").value = item.status === "Rusak" ? "Darurat" : "Sedang";
        document.getElementById("mntIssue").value = "";

        if (mntModal) mntModal.style.display = "flex";
    }

    const closeMntModal = () => { if (mntModal) mntModal.style.display = "none"; };
    if (closeMntBtn) closeMntBtn.onclick = closeMntModal;
    if (cancelMntBtn) cancelMntBtn.onclick = closeMntModal;

    if (mntForm) {
        mntForm.onsubmit = (e) => {
            e.preventDefault();

            const eqId = document.getElementById("mntEqId").value;
            const eqName = document.getElementById("mntEqName").value;
            const eqRoom = document.getElementById("mntEqRoom").value;
            const priority = document.getElementById("mntPriority").value;
            const issue = document.getElementById("mntIssue").value;

            const existingMaintenance = JSON.parse(localStorage.getItem("mediTrack_maintenanceData")) || [];

            const newTicket = {
                ticketId: `MNT-${Math.floor(1000 + Math.random() * 9000)}`,
                equipmentId: eqId,
                equipmentName: eqName,
                room: eqRoom,
                issue: issue,
                priority: priority,
                status: "Pending",
                dateAdded: new Date().toISOString().split('T')[0]
            };

            existingMaintenance.unshift(newTicket);
            localStorage.setItem("mediTrack_maintenanceData", JSON.stringify(existingMaintenance));

            closeMntModal();
            alert("Tiket Maintenance berhasil dikirim ke halaman Maintenance!");
        };
    }

    // EVENT TAMBAH ALAT BARU
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

            const newItem = {
                id: uniqueId,
                name: document.getElementById("inputName").value,
                category: document.getElementById("inputCategory").value,
                room: document.getElementById("inputRoom").value,
                status: document.getElementById("inputStatus").value,
                battery: 100,
                usage: 0
            };

            equipmentData.unshift(newItem);
            saveEquipmentData(equipmentData);
            renderTable();

            closeModal();
        };
    }

    if (searchInput) searchInput.oninput = renderTable;
    if (statusFilter) statusFilter.onchange = renderTable;

    renderTable();
});

function syncSidebarProfile() {
    const savedProfile = localStorage.getItem("mediTrack_profile");
    if (!savedProfile) return;

    try {
        const profile = JSON.parse(savedProfile);
        const sidebarName = document.getElementById("sidebarName");
        const sidebarRole = document.getElementById("sidebarRole");
        if (sidebarName && profile.name) sidebarName.textContent = profile.name;
        if (sidebarRole && profile.role) sidebarRole.textContent = profile.role;
    } catch (e) {
        console.error("Gagal memuat profil:", e);
    }
}