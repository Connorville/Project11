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

    function renderMaintenanceTable() {
        if (!tableBody) return;

        tableBody.innerHTML = "";

        // Tampilkan tiket aktif yang valid
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
            // Safe fallback jika properti bernilai undefined
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

        // Event listener Hapus Paksa
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

            // Update status alat di equipmentData
            const equipmentData = JSON.parse(localStorage.getItem("mediTrack_equipmentData")) || [];
            const eq = equipmentData.find(e => e.id === (ticket.equipmentId || ticket.eqId));
            if (eq) {
                eq.status = "Baik";
                localStorage.setItem("mediTrack_equipmentData", JSON.stringify(equipmentData));
            }

            maintenanceData = getMaintenanceData();
            renderMaintenanceTable();
        } else {
            // Jika data rusak dan id tidak ditemukan, hapus otomatis
            deleteMaintenanceTicket(ticketId);
        }
    }

    function deleteMaintenanceTicket(ticketId) {
        maintenanceData = maintenanceData.filter(m => (m.ticketId !== ticketId && m.id !== ticketId && ticketId !== "MNT-UNKNOWN"));
        saveMaintenanceData(maintenanceData);
        renderMaintenanceTable();
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