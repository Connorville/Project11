document.addEventListener("DOMContentLoaded", () => {
    const mockEquipmentData = [
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
        localStorage.setItem("mediTrack_equipmentData", JSON.stringify(mockEquipmentData));
        return mockEquipmentData;
    }

    function saveEquipmentData(data) {
        localStorage.setItem("mediTrack_equipmentData", JSON.stringify(data));
    }

    let equipmentData = getEquipmentData();
    let activeDashId = null;

    function renderDashboard() {
        equipmentData = getEquipmentData();

        // Update Kartu Statistik
        document.getElementById("dashTotalEq").textContent = equipmentData.length;
        document.getElementById("dashGoodEq").textContent = equipmentData.filter(i => i.status === "Baik").length;
        document.getElementById("dashWarnEq").textContent = equipmentData.filter(i => i.status === "Perlu Perbaikan").length;
        document.getElementById("dashDangerEq").textContent = equipmentData.filter(i => i.status === "Rusak").length;

        const table = document.getElementById("dashEquipmentTable");
        table.innerHTML = "";

        // Menampilkan 5 data paling baru
        const recentItems = [...equipmentData].reverse().slice(0, 5);

        recentItems.forEach(item => {
            let statusClass = "status-good";
            if (item.status === "Perlu Perbaikan") statusClass = "status-warning";
            if (item.status === "Rusak") statusClass = "status-danger";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.id}</td>
                <td><strong>${item.name}</strong></td>
                <td>${item.room}</td>
                <td><span class="status ${statusClass}">${item.status}</span></td>
                <td>
                    <button class="btn-action dash-view-btn" data-id="${item.id}">Detail</button>
                </td>
            `;
            table.appendChild(row);
        });

        document.querySelectorAll(".dash-view-btn").forEach(btn => {
            btn.addEventListener("click", (e) => openDashModal(e.target.dataset.id));
        });
    }

    // Modal Detail Ringkas di Dashboard
    const modal = document.getElementById("dashDetailModal");
    function openDashModal(id) {
        const item = equipmentData.find(eq => eq.id === id);
        if (!item) return;

        activeDashId = id;
        document.getElementById("dDashId").textContent = item.id;
        document.getElementById("dDashName").textContent = item.name;
        document.getElementById("dDashRoom").textContent = item.room;
        
        const st = document.getElementById("dDashStatus");
        st.textContent = item.status;
        st.className = "status " + (item.status === "Baik" ? "status-good" : item.status === "Perlu Perbaikan" ? "status-warning" : "status-danger");

        modal.style.display = "flex";
    }

    document.getElementById("closeDashDetail").onclick = () => modal.style.display = "none";
    document.getElementById("cancelDashDetail").onclick = () => modal.style.display = "none";

    document.getElementById("dashDeleteOneBtn").onclick = () => {
        if (activeDashId) {
            equipmentData = equipmentData.filter(i => i.id !== activeDashId);
            saveEquipmentData(equipmentData);
            renderDashboard();
            modal.style.display = "none";
        }
    };

    renderDashboard();
});