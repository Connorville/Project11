// Data Mock Bawaan
const mockEquipmentData = [
    { id: "ALT-2026-001", name: "Patient Monitor", category: "Diagnostik", room: "ICU Utama", status: "Baik" },
    { id: "ALT-2026-002", name: "Ventilator", category: "Pendukung Kehidupan", room: "ICU Ruang 2", status: "Perlu Perbaikan" },
    { id: "ALT-2026-003", name: "ECG Machine", category: "Diagnostik", room: "Poli Jantung", status: "Baik" },
    { id: "ALT-2026-004", name: "Infusion Pump", category: "Pendukung Kehidupan", room: "Rawat Inap 3", status: "Baik" },
    { id: "ALT-2026-005", name: "Pulse Oximeter", category: "Diagnostik", room: "UGD", status: "Rusak" }
];

// Memuat data dari localStorage
function loadEquipmentData() {
    const saved = localStorage.getItem("mediTrack_equipmentData");
    if (saved !== null) {
        return JSON.parse(saved);
    }
    localStorage.setItem("mediTrack_equipmentData", JSON.stringify(mockEquipmentData));
    return mockEquipmentData;
}

// Menyimpan data ke localStorage
function saveEquipmentData(data) {
    localStorage.setItem("mediTrack_equipmentData", JSON.stringify(data));
}

let equipmentData = loadEquipmentData();

document.addEventListener("DOMContentLoaded", () => {
    const table = document.getElementById("equipmentTable");
    const emptyState = document.getElementById("emptyState");
    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");
    const resultCount = document.getElementById("resultCount");

    let activeItemId = null;

    // Memperbarui kartu statistik di bagian atas
    function updateSummaryCards(data) {
        const total = data.length;
        const good = data.filter(item => item.status === "Baik").length;
        const warn = data.filter(item => item.status === "Perlu Perbaikan").length;
        const danger = data.filter(item => item.status === "Rusak").length;

        if (document.getElementById("eqTotalCount")) document.getElementById("eqTotalCount").textContent = total;
        if (document.getElementById("eqGoodCount")) document.getElementById("eqGoodCount").textContent = good;
        if (document.getElementById("eqWarnCount")) document.getElementById("eqWarnCount").textContent = warn;
        if (document.getElementById("eqDangerCount")) document.getElementById("eqDangerCount").textContent = danger;
    }

    // Render Tabel utama
    function renderTable() {
        const search = searchInput ? searchInput.value.toLowerCase() : "";
        const selectedStatus = statusFilter ? statusFilter.value : "Semua";

        const filtered = equipmentData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(search) ||
                                  item.id.toLowerCase().includes(search) ||
                                  item.room.toLowerCase().includes(search);
            const matchesStatus = selectedStatus === "Semua" || item.status === selectedStatus;
            return matchesSearch && matchesStatus;
        });

        table.innerHTML = "";

        filtered.forEach(item => {
            let statusClass = "status-good";
            if (item.status === "Perlu Perbaikan") statusClass = "status-warning";
            if (item.status === "Rusak") statusClass = "status-danger";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.id}</td>
                <td><strong>${item.name}</strong></td>
                <td>${item.category}</td>
                <td>${item.room}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
                <td>
                    <button class="btn-action view-btn" data-id="${item.id}">Detail</button>
                    <button class="btn-action delete-btn" data-id="${item.id}">Hapus</button>
                </td>
            `;
            table.appendChild(row);
        });

        if (resultCount) resultCount.textContent = `${filtered.length} alat`;
        
        if (filtered.length === 0) {
            if (emptyState) emptyState.style.display = "block";
        } else {
            if (emptyState) emptyState.style.display = "none";
        }

        // Perbarui angka kartu statistik
        updateSummaryCards(equipmentData);

        // Listener tombol Detail & Hapus di tabel
        document.querySelectorAll(".view-btn").forEach(btn => {
            btn.addEventListener("click", (e) => openDetailModal(e.target.dataset.id));
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", (e) => deleteSingleEquipment(e.target.dataset.id));
        });
    }

    // MODAL DETAIL & EDIT STATUS
    const detailModal = document.getElementById("detailModal");
    function openDetailModal(id) {
        const item = equipmentData.find(eq => eq.id === id);
        if (!item) return;

        activeItemId = id;
        document.getElementById("dtId").textContent = item.id;
        document.getElementById("dtName").textContent = item.name;
        document.getElementById("dtCategory").textContent = item.category;
        document.getElementById("dtRoom").textContent = item.room;

        // Set pilihan dropdown status sesuai status alat saat ini
        const statusSelect = document.getElementById("dtStatusSelect");
        if (statusSelect) {
            statusSelect.value = item.status;
        }

        detailModal.style.display = "flex";
    }

    // MENYIMPAN PERUBAHAN STATUS
    const saveStatusBtn = document.getElementById("saveStatusBtn");
    if (saveStatusBtn) {
        saveStatusBtn.onclick = () => {
            if (!activeItemId) return;

            const newStatus = document.getElementById("dtStatusSelect").value;
            const targetItem = equipmentData.find(item => item.id === activeItemId);

            if (targetItem) {
                targetItem.status = newStatus;
                saveEquipmentData(equipmentData);
                renderTable();
                detailModal.style.display = "none";
            }
        };
    }

    if (document.getElementById("closeDetailModal")) document.getElementById("closeDetailModal").onclick = () => detailModal.style.display = "none";
    if (document.getElementById("cancelDetailModal")) document.getElementById("cancelDetailModal").onclick = () => detailModal.style.display = "none";

    // HAPUS SATU ALAT
    function deleteSingleEquipment(id) {
        equipmentData = equipmentData.filter(item => item.id !== id);
        saveEquipmentData(equipmentData);
        renderTable();
        if (detailModal) detailModal.style.display = "none";
    }

    if (document.getElementById("deleteOneBtn")) {
        document.getElementById("deleteOneBtn").onclick = () => {
            if (activeItemId) deleteSingleEquipment(activeItemId);
        };
    }

    // HAPUS SEMUA ALAT
    const deleteAllModal = document.getElementById("confirmDeleteAllModal");
    if (document.getElementById("deleteAllEquipment")) {
        document.getElementById("deleteAllEquipment").onclick = () => deleteAllModal.style.display = "flex";
    }
    if (document.getElementById("closeConfirmDeleteAll")) {
        document.getElementById("closeConfirmDeleteAll").onclick = () => deleteAllModal.style.display = "none";
    }
    if (document.getElementById("cancelDeleteAll")) {
        document.getElementById("cancelDeleteAll").onclick = () => deleteAllModal.style.display = "none";
    }
    if (document.getElementById("confirmDeleteAllBtn")) {
        document.getElementById("confirmDeleteAllBtn").onclick = () => {
            equipmentData = [];
            saveEquipmentData(equipmentData);
            renderTable();
            deleteAllModal.style.display = "none";
        };
    }

    // TAMBAH ALAT BARU
    const addModal = document.getElementById("addModal");
    if (document.getElementById("addEquipmentBtn")) {
        document.getElementById("addEquipmentBtn").onclick = () => addModal.style.display = "flex";
    }
    if (document.getElementById("closeAddModal")) {
        document.getElementById("closeAddModal").onclick = () => addModal.style.display = "none";
    }
    if (document.getElementById("cancelAddModal")) {
        document.getElementById("cancelAddModal").onclick = () => addModal.style.display = "none";
    }

    if (document.getElementById("addForm")) {
        document.getElementById("addForm").onsubmit = (e) => {
            e.preventDefault();
            
            const uniqueId = `ALT-${Math.floor(1000 + Math.random() * 9000)}`;

            const newItem = {
                id: uniqueId,
                name: document.getElementById("eqName").value,
                category: document.getElementById("eqCategory").value,
                room: document.getElementById("eqRoom").value,
                status: document.getElementById("eqStatus").value
            };

            equipmentData.push(newItem);
            saveEquipmentData(equipmentData);
            renderTable();
            
            addModal.style.display = "none";
            document.getElementById("addForm").reset();
        };
    }

    if (searchInput) searchInput.oninput = renderTable;
    if (statusFilter) statusFilter.onchange = renderTable;

    renderTable();
});