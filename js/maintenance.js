document.addEventListener("DOMContentLoaded", () => {
    syncSidebarProfile();

    const mockMaintenanceData = [
        {
            ticketId: "MNT-1002",
            equipmentId: "ALT-2026-002",
            equipmentName: "Ventilator",
            room: "ICU Ruang 2",
            issue: "Tekanan udara berkurang saat digunakan.",
            priority: "Tinggi",
            status: "Pending",
            dateAdded: "2026-05-18"
        },
        {
            ticketId: "MNT-1005",
            equipmentId: "ALT-2026-005",
            equipmentName: "Pulse Oximeter",
            room: "UGD",
            issue: "Layar mati total dan tidak mengisi daya.",
            priority: "Darurat",
            status: "Pending",
            dateAdded: "2026-05-19"
        }
    ];

    function getMaintenanceData() {
        const saved = localStorage.getItem("mediTrack_maintenanceData");
        if (saved !== null) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Data JSON rusak, memuat data mock...", e);
            }
        }
        localStorage.setItem("mediTrack_maintenanceData", JSON.stringify(mockMaintenanceData));
        return mockMaintenanceData;
    }

    function saveMaintenanceData(data) {
        localStorage.setItem("mediTrack_maintenanceData", JSON.stringify(data));
    }

    let maintenanceData = getMaintenanceData();
    const tableBody = document.getElementById("maintenanceTableBody");

    // Modal Elements
    const mntModal = document.getElementById("maintenanceModal");
    const addMntBtn = document.getElementById("addMaintenanceBtn");
    const closeMntBtn = document.getElementById("closeMntModalBtn");
    const cancelMntBtn = document.getElementById("cancelMntModalBtn");
    const mntForm = document.getElementById("addMaintenanceForm");
    const selectEquipment = document.getElementById("selectEquipment");

    function renderMaintenanceTable() {
        if (!tableBody) return;

        tableBody.innerHTML = "";

        const activeTickets = maintenanceData.filter(m => m && m.status !== "Selesai");

        if (activeTickets.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: #64748b;">
                        Tidak ada tiket pemeliharaan aktif saat ini.
                    </td>
                </tr>
            `;
            return;
        }

        activeTickets.forEach(item => {
            const tId = item.ticketId || item.id || "MNT-UNKNOWN";
            const eName = item.equipmentName || item.name || "Perangkat Medis";
            const eId = item.equipmentId || item.eqId || "-";
            const room = item.room || "-";
            const issue = item.issue || item.description || item.type || "-";
            const priority = item.priority || "Sedang";
            const status = item.status || "Pending";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td><strong>${tId}</strong></td>
                <td>${eName} <br><small style="color:#64748b;">${eId}</small></td>
                <td>${room}</td>
                <td>${issue}</td>
                <td><span class="priority-badge priority-${priority.toLowerCase()}">${priority}</span></td>
                <td><span class="status-badge status-${status.toLowerCase()}">${status}</span></td>
                <td style="text-align: center;">
                    <button class="btn-action complete-btn" data-id="${tId}" title="Tandai Selesai" style="padding: 6px 12px; cursor: pointer; background: #16a34a; color: white; border: none; border-radius: 6px; font-weight: bold;">✓ Selesai</button>
                    <button class="btn-action delete-mnt-btn" data-id="${tId}" title="Hapus Tiket" style="padding: 6px 10px; cursor: pointer; background: #ef4444; color: white; border: none; border-radius: 6px; font-weight: bold; margin-left: 4px;">🗑</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Event listener Selesai
        document.querySelectorAll(".complete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const targetBtn = e.target.closest(".complete-btn");
                if (targetBtn) {
                    completeMaintenanceTicket(targetBtn.dataset.id);
                }
            });
        });

        // Event listener Hapus
        document.querySelectorAll(".delete-mnt-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const targetBtn = e.target.closest(".delete-mnt-btn");
                if (targetBtn) {
                    deleteMaintenanceTicket(targetBtn.dataset.id);
                }
            });
        });
    }

    function completeMaintenanceTicket(ticketId) {
        if (!confirm(`Tandai perbaikan tiket ${ticketId} sebagai Selesai?`)) return;

        const ticket = maintenanceData.find(m => (m.ticketId === ticketId || m.id === ticketId));
        if (ticket) {
            ticket.status = "Selesai";
            saveMaintenanceData(maintenanceData);

            // Update status alat di equipmentData menjadi Baik
            const equipmentData = JSON.parse(localStorage.getItem("mediTrack_equipmentData")) || [];
            const eq = equipmentData.find(e => e.id === (ticket.equipmentId || ticket.eqId));
            if (eq) {
                eq.status = "Baik";
                localStorage.setItem("mediTrack_equipmentData", JSON.stringify(equipmentData));
            }

            maintenanceData = getMaintenanceData();
            renderMaintenanceTable();
        } else {
            deleteMaintenanceTicket(ticketId);
        }
    }

    function deleteMaintenanceTicket(ticketId) {
        maintenanceData = maintenanceData.filter(m => (m.ticketId !== ticketId && m.id !== ticketId && ticketId !== "MNT-UNKNOWN"));
        saveMaintenanceData(maintenanceData);
        renderMaintenanceTable();
    }

    // HANDLER BUKA MODAL MAINTENANCE
    if (addMntBtn && mntModal) {
        addMntBtn.onclick = () => {
            populateEquipmentOptions();
            if (mntForm) mntForm.reset();
            mntModal.style.display = "flex";
        };
    }

    function populateEquipmentOptions() {
        if (!selectEquipment) return;
        const equipmentData = JSON.parse(localStorage.getItem("mediTrack_equipmentData")) || [];
        selectEquipment.innerHTML = "";

        if (equipmentData.length === 0) {
            selectEquipment.innerHTML = `<option value="">Tidak ada alat tersedia</option>`;
            return;
        }

        equipmentData.forEach(eq => {
            const opt = document.createElement("option");
            opt.value = eq.id;
            opt.textContent = `${eq.name} (${eq.id}) - Ruang: ${eq.room}`;
            selectEquipment.appendChild(opt);
        });
    }

    const closeModal = () => { if (mntModal) mntModal.style.display = "none"; };
    if (closeMntBtn) closeMntBtn.onclick = closeModal;
    if (cancelMntBtn) cancelMntBtn.onclick = closeModal;

    // HANDLER SUBMIT FORM MAINTENANCE
    if (mntForm) {
        mntForm.onsubmit = (e) => {
            e.preventDefault();

            const eqId = selectEquipment.value;
            const equipmentData = JSON.parse(localStorage.getItem("mediTrack_equipmentData")) || [];
            const selectedEq = equipmentData.find(e => e.id === eqId);

            if (!selectedEq) {
                alert("Silakan pilih alat yang valid.");
                return;
            }

            const priority = document.getElementById("inputPriority").value;
            const issue = document.getElementById("inputIssue").value;

            // Update status alat di daftar alat menjadi Perlu Perbaikan jika tadinya Baik
            if (selectedEq.status === "Baik") {
                selectedEq.status = priority === "Darurat" ? "Rusak" : "Perlu Perbaikan";
                localStorage.setItem("mediTrack_equipmentData", JSON.stringify(equipmentData));
            }

            const newTicket = {
                ticketId: `MNT-${Math.floor(1000 + Math.random() * 9000)}`,
                equipmentId: selectedEq.id,
                equipmentName: selectedEq.name,
                room: selectedEq.room,
                issue: issue,
                priority: priority,
                status: "Pending",
                dateAdded: new Date().toISOString().split('T')[0]
            };

            maintenanceData.unshift(newTicket);
            saveMaintenanceData(maintenanceData);
            renderMaintenanceTable();

            closeModal();
        };
    }

    renderMaintenanceTable();
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