// Data Awal Mock untuk Maintenance
const mockMaintenanceData = [
    { id: "ALT-2026-002", name: "Ventilator", room: "ICU Ruang 2", type: "Perbaikan Total", priority: "Tinggi", status: "Menunggu Teknisi" },
    { id: "ALT-2026-005", name: "Pulse Oximeter", room: "UGD", type: "Servis Berkala", priority: "Sedang", status: "Dalam Proses" }
];

function loadMaintenanceData() {
    const saved = localStorage.getItem("mediTrack_maintenanceData");
    if (saved !== null) {
        return JSON.parse(saved);
    }
    localStorage.setItem("mediTrack_maintenanceData", JSON.stringify(mockMaintenanceData));
    return mockMaintenanceData;
}

function saveMaintenanceData(data) {
    localStorage.setItem("mediTrack_maintenanceData", JSON.stringify(data));
}

let maintenanceData = loadMaintenanceData();

document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("maintenanceTableBody");
    const maintInfo = document.getElementById("maintInfo");
    const maintModal = document.getElementById("maintenanceModal");
    const addMaintBtn = document.getElementById("addMaintBtn");
    const closeMaintModalBtn = document.getElementById("closeMaintModalBtn");
    const cancelMaintModalBtn = document.getElementById("cancelMaintModalBtn");
    const maintenanceForm = document.getElementById("maintenanceForm");
    const maintEquipmentSelect = document.getElementById("maintEquipmentSelect");

    // Helper Badge Prioritas
    function getPriorityClass(priority) {
        if (priority === "Tinggi") return "status-critical";
        if (priority === "Sedang") return "status-warning";
        return "status-good";
    }

    // Render Tabel Maintenance
    function renderTable() {
        if (!tableBody) return;
        tableBody.innerHTML = "";

        if (maintenanceData.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: #64748b;">
                        Belum ada jadwal maintenance yang terdaftar.
                    </td>
                </tr>
            `;
        } else {
            maintenanceData.forEach((item, index) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><strong>${item.id}</strong></td>
                    <td>${item.name}</td>
                    <td>${item.room}</td>
                    <td>${item.type}</td>
                    <td><span class="status-badge ${getPriorityClass(item.priority)}">${item.priority}</span></td>
                    <td><strong style="color: #2563eb; font-size: 13px;">${item.status}</strong></td>
                    <td style="text-align: center;">
                        <button class="btn-action delete-maint-btn" data-index="${index}" title="Hapus Jadwal">🗑</button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        }

        if (maintInfo) {
            maintInfo.textContent = `Menampilkan ${maintenanceData.length} jadwal maintenance`;
        }

        // Event Hapus Jadwal
        document.querySelectorAll(".delete-maint-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = e.currentTarget.dataset.index;
                if (confirm("Apakah Anda yakin ingin menghapus jadwal maintenance ini?")) {
                    maintenanceData.splice(idx, 1);
                    saveMaintenanceData(maintenanceData);
                    renderTable();
                }
            });
        });
    }

    // Memuat Opsi Perangkat Medis dari localStorage (Daftar Alat)
    function populateEquipmentSelect() {
        const savedEq = localStorage.getItem("mediTrack_equipmentData");
        const equipmentList = savedEq ? JSON.parse(savedEq) : [];
        maintEquipmentSelect.innerHTML = "";

        if (equipmentList.length === 0) {
            maintEquipmentSelect.innerHTML = `<option value="">-- Tidak ada alat tersedia --</option>`;
            return;
        }

        equipmentList.forEach(eq => {
            const opt = document.createElement("option");
            opt.value = eq.id;
            opt.dataset.name = eq.name;
            opt.dataset.room = eq.room;
            opt.textContent = `${eq.id} - ${eq.name} (${eq.room})`;
            maintEquipmentSelect.appendChild(opt);
        });
    }

    // Modal Control
    if (addMaintBtn && maintModal) {
        addMaintBtn.onclick = () => {
            populateEquipmentSelect();
            maintenanceForm.reset();
            maintModal.style.display = "flex";
        };
    }

    const closeModal = () => {
        if (maintModal) maintModal.style.display = "none";
    };

    if (closeMaintModalBtn) closeMaintModalBtn.onclick = closeModal;
    if (cancelMaintModalBtn) cancelMaintModalBtn.onclick = closeModal;

    // Form Submit Jadwal Baru
    if (maintenanceForm) {
        maintenanceForm.onsubmit = (e) => {
            e.preventDefault();

            const selectedOption = maintEquipmentSelect.options[maintEquipmentSelect.selectedIndex];
            if (!selectedOption || !selectedOption.value) {
                alert("Silakan pilih perangkat medis terlebih dahulu.");
                return;
            }

            const newSchedule = {
                id: selectedOption.value,
                name: selectedOption.dataset.name,
                room: selectedOption.dataset.room,
                type: document.getElementById("maintType").value,
                priority: document.getElementById("maintPriority").value,
                status: document.getElementById("maintStatus").value
            };

            maintenanceData.unshift(newSchedule);
            saveMaintenanceData(maintenanceData);
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