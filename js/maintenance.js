// ===============================
// DATA MAINTENANCE
// ===============================

const maintenanceData = [

    {
        id: "MD-2026-001",
        name: "Patient Monitor",
        type: "Diagnostik",
        date: "16 September 2026",
        status: "Menunggu"
    },

    {
        id: "MD-2026-002",
        name: "Ventilator",
        type: "Pendukung Kehidupan",
        date: "9 Oktober 2026",
        status: "Dalam Proses"
    },

    {
        id: "MD-2026-003",
        name: "ECG Machine",
        type: "Diagnostik",
        date: "12 September 2026",
        status: "Selesai"
    },

    {
        id: "MD-2026-004",
        name: "Infusion Pump",
        type: "Pendukung Kehidupan",
        date: "2 November 2026",
        status: "Menunggu"
    },

    {
        id: "MD-2026-005",
        name: "Pulse Oximeter",
        type: "Diagnostik",
        date: "29 September 2026",
        status: "Selesai"
    }

];


// ===============================
// ELEMENT
// ===============================

const table =
    document.getElementById("maintenanceTable");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");

const resultCount =
    document.getElementById("resultCount");


// ===============================
// RENDER TABLE
// ===============================

function renderMaintenance() {

    const search =
        searchInput.value.toLowerCase();

    const selectedStatus =
        statusFilter.value;


    const filteredData =
        maintenanceData.filter(item => {

            const matchesSearch =
                item.name.toLowerCase().includes(search) ||
                item.id.toLowerCase().includes(search);

            const matchesStatus =
                selectedStatus === "Semua" ||
                item.status === selectedStatus;

            return matchesSearch && matchesStatus;

        });


    table.innerHTML = "";


    filteredData.forEach(item => {

        const row =
            document.createElement("tr");

        let statusClass = "status-pending";

        if (item.status === "Dalam Proses") {
            statusClass = "status-progress";
        }

        if (item.status === "Selesai") {
            statusClass = "status-completed";
        }


        row.innerHTML = `

            <td>${item.id}</td>

            <td>
                <span class="equipment-name">
                    ${item.name}
                </span>
            </td>

            <td>
                <span class="equipment-type">
                    ${item.type}
                </span>
            </td>

            <td>
                <span class="date">
                    ${item.date}
                </span>
            </td>

            <td>
                <span class="status ${statusClass}">
                    ${item.status}
                </span>
            </td>

            <td>

                <button
                    class="action-button"
                    onclick="handleMaintenance('${item.id}')"
                >
                    ${
                        item.status === "Selesai"
                        ? "Lihat"
                        : "Proses"
                    }
                </button>

            </td>

        `;


        table.appendChild(row);

    });


    resultCount.textContent =
        `${filteredData.length} jadwal`;


    if (filteredData.length === 0) {

        emptyState.classList.add("show");

    } else {

        emptyState.classList.remove("show");

    }

}


// ===============================
// UPDATE STATISTICS
// ===============================

function updateStatistics() {

    const total =
        maintenanceData.length;

    const pending =
        maintenanceData.filter(
            item => item.status === "Menunggu"
        ).length;

    const progress =
        maintenanceData.filter(
            item => item.status === "Dalam Proses"
        ).length;

    const completed =
        maintenanceData.filter(
            item => item.status === "Selesai"
        ).length;


    document.getElementById(
        "totalMaintenance"
    ).textContent = total;


    document.getElementById(
        "pendingMaintenance"
    ).textContent = pending;


    document.getElementById(
        "progressMaintenance"
    ).textContent = progress;


    document.getElementById(
        "completedMaintenance"
    ).textContent = completed;

}


// ===============================
// HANDLE MAINTENANCE
// ===============================

function handleMaintenance(id) {

    const item =
        maintenanceData.find(
            equipment => equipment.id === id
        );


    if (!item) return;


    if (item.status === "Selesai") {

        alert(
            `Maintenance ${item.name}\n\n` +
            `Status: Selesai\n` +
            `Tanggal: ${item.date}`
        );

        return;
    }


    const confirmProcess =
        confirm(
            `Mulai maintenance untuk ${item.name}?`
        );


    if (!confirmProcess) return;


    item.status = "Dalam Proses";


    updateStatistics();

    renderMaintenance();

}


// ===============================
// SEARCH
// ===============================

searchInput.addEventListener(
    "input",
    renderMaintenance
);


// ===============================
// FILTER
// ===============================

statusFilter.addEventListener(
    "change",
    renderMaintenance
);


// ===============================
// ADD MAINTENANCE
// ===============================

document.getElementById(
    "addMaintenance"
).addEventListener(
    "click",
    () => {

        alert(
            "Fitur penjadwalan maintenance akan " +
            "dikembangkan pada tahap berikutnya."
        );

    }
);


// ===============================
// SIDEBAR MOBILE
// ===============================

const menuButton =
    document.getElementById("menuButton");

const sidebar =
    document.getElementById("sidebar");


menuButton.addEventListener(
    "click",
    () => {

        sidebar.classList.toggle("show");

    }
);


// ===============================
// SIMULATION
// ===============================

document.getElementById(
    "simulationLink"
).addEventListener(
    "click",
    event => {

        event.preventDefault();

        alert(
            "Halaman Simulasi akan dibuat " +
            "pada langkah berikutnya."
        );

    }
);


// ===============================
// SETTINGS
// ===============================

document.getElementById(
    "settingsLink"
).addEventListener(
    "click",
    event => {

        event.preventDefault();

        alert(
            "Halaman Pengaturan akan dibuat " +
            "pada tahap berikutnya."
        );

    }
);


// ===============================
// INIT
// ===============================

updateStatistics();

renderMaintenance();