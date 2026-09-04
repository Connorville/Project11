/* =========================
   DATA ALAT MEDIS
========================= */

const equipment = [
    {
        id: "MD-2026-001",
        name: "Patient Monitor",
        type: "Diagnostik",
        usage: 128,
        battery: 87,
        calibration: 12,
        score: 94,
        status: "Baik"
    },

    {
        id: "MD-2026-002",
        name: "Ventilator",
        type: "Pendukung Kehidupan",
        usage: 245,
        battery: 62,
        calibration: 35,
        score: 76,
        status: "Perlu Periksa"
    },

    {
        id: "MD-2026-003",
        name: "ECG Machine",
        type: "Diagnostik",
        usage: 87,
        battery: 91,
        calibration: 8,
        score: 97,
        status: "Baik"
    },

    {
        id: "MD-2026-004",
        name: "Infusion Pump",
        type: "Pendukung Kehidupan",
        usage: 312,
        battery: 44,
        calibration: 58,
        score: 61,
        status: "Kritis"
    },

    {
        id: "MD-2026-005",
        name: "Pulse Oximeter",
        type: "Diagnostik",
        usage: 174,
        battery: 78,
        calibration: 20,
        score: 89,
        status: "Baik"
    }
];


/* =========================
   ELEMENT
========================= */

const tableBody = document.getElementById("equipmentTable");

const searchInput = document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const statusFilter =
    document.getElementById("statusFilter");

const equipmentCount =
    document.getElementById("equipmentCount");

const emptyState =
    document.getElementById("emptyState");

const resetFilter =
    document.getElementById("resetFilter");


/* =========================
   STATUS CLASS
========================= */

function getStatusClass(status) {

    if (status === "Baik") {
        return "good";
    }

    if (status === "Perlu Periksa") {
        return "warning";
    }

    return "critical";
}


/* =========================
   RENDER TABLE
========================= */

function renderEquipment(data) {

    tableBody.innerHTML = "";

    if (data.length === 0) {

        emptyState.style.display = "block";

        equipmentCount.textContent = "0 alat";

        return;
    }

    emptyState.style.display = "none";

    equipmentCount.textContent =
        `${data.length} alat`;

    data.forEach(item => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <div class="equipment-info">

                    <div class="equipment-icon">
                        +
                    </div>

                    <div>
                        <strong>${item.name}</strong>
                        <small>${item.id}</small>
                    </div>

                </div>
            </td>

            <td>
                <span class="category">
                    ${item.type}
                </span>
            </td>

            <td>
                <span class="data-value">
                    ${item.usage} kali
                </span>
            </td>

            <td>

                <span class="data-value">
                    ${item.battery}%
                </span>

                <div class="progress-mini">
                    <div
                        class="progress-mini-fill"
                        style="width: ${item.battery}%">
                    </div>
                </div>

            </td>

            <td>
                <span class="data-value">
                    ${item.calibration} hari
                </span>
            </td>

            <td>
                <span class="status ${getStatusClass(item.status)}">
                    ${item.status}
                </span>
            </td>

            <td>
                <button
                    class="detail-button"
                    onclick="showDetail('${item.id}')">
                    Detail
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}


/* =========================
   FILTER
========================= */

function filterEquipment() {

    const search =
        searchInput.value.toLowerCase();

    const category =
        categoryFilter.value;

    const status =
        statusFilter.value;

    const filtered =
        equipment.filter(item => {

            const matchesSearch =
                item.name.toLowerCase().includes(search) ||
                item.id.toLowerCase().includes(search);

            const matchesCategory =
                category === "all" ||
                item.type === category;

            const matchesStatus =
                status === "all" ||
                item.status === status;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            );
        });

    renderEquipment(filtered);
}


/* =========================
   SUMMARY
========================= */

function updateSummary() {

    const total =
        equipment.length;

    const good =
        equipment.filter(
            item => item.status === "Baik"
        ).length;

    const check =
        equipment.filter(
            item => item.status === "Perlu Periksa"
        ).length;

    const critical =
        equipment.filter(
            item => item.status === "Kritis"
        ).length;

    document.getElementById("totalEquipment")
        .textContent = total;

    document.getElementById("goodEquipment")
        .textContent = good;

    document.getElementById("checkEquipment")
        .textContent = check;

    document.getElementById("criticalEquipment")
        .textContent = critical;
}


/* =========================
   DETAIL
========================= */

function showDetail(id) {
    window.location.href = `equipment_detail.html?id=${id}`;
}


/* =========================
   RESET FILTER
========================= */

resetFilter.addEventListener("click", () => {

    searchInput.value = "";

    categoryFilter.value = "all";

    statusFilter.value = "all";

    filterEquipment();
});


/* =========================
   EVENT SEARCH
========================= */

searchInput.addEventListener(
    "input",
    filterEquipment
);

categoryFilter.addEventListener(
    "change",
    filterEquipment
);

statusFilter.addEventListener(
    "change",
    filterEquipment
);


/* =========================
   TAMBAH ALAT
========================= */

document
    .getElementById("addEquipment")
    .addEventListener("click", () => {

        alert(
            "Fitur Tambah Alat\n\n" +
            "Fitur ini akan dikembangkan " +
            "pada tahap berikutnya."
        );

    });


/* =========================
   NAVIGATION PLACEHOLDER
========================= */

document
    .getElementById("maintenanceLink")
    .addEventListener("click", event => {

        event.preventDefault();

        alert(
            "Halaman Maintenance akan " +
            "dibuat pada tahap berikutnya."
        );

    });


document
    .getElementById("simulationLink")
    .addEventListener("click", event => {

        event.preventDefault();

        alert(
            "Halaman Simulasi akan " +
            "dibuat pada tahap berikutnya."
        );

    });


document
    .getElementById("settingsLink")
    .addEventListener("click", event => {

        event.preventDefault();

        alert(
            "Pengaturan belum tersedia " +
            "pada prototype."
        );

    });


/* =========================
   MOBILE SIDEBAR
========================= */

const mobileMenu =
    document.getElementById("mobileMenu");

const sidebar =
    document.getElementById("sidebar");

mobileMenu.addEventListener("click", () => {

    sidebar.classList.toggle("open");

});


/* =========================
   INITIALIZE
========================= */

updateSummary();

renderEquipment(equipment);