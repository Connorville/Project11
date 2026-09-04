// ========================================
// DATA ALAT MEDIS
// ========================================

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


// ========================================
// AKTIVITAS
// ========================================

const activities = [
    {
        icon: "✓",
        title: "Patient Monitor diperiksa",
        description: "Kondisi alat diperbarui",
        time: "10 menit lalu"
    },

    {
        icon: "↻",
        title: "Ventilator digunakan",
        description: "Jumlah penggunaan bertambah",
        time: "32 menit lalu"
    },

    {
        icon: "!",
        title: "Infusion Pump membutuhkan perhatian",
        description: "Skor kondisi berada di bawah batas aman",
        time: "1 jam lalu"
    },

    {
        icon: "✓",
        title: "ECG Machine dikalibrasi",
        description: "Kalibrasi berhasil dicatat",
        time: "2 jam lalu"
    }
];


// ========================================
// STATISTIK
// ========================================

function updateStatistics() {

    const total = equipment.length;

    const good = equipment.filter(
        item => item.status === "Baik"
    ).length;

    const inspection = equipment.filter(
        item => item.status === "Perlu Periksa"
    ).length;

    const critical = equipment.filter(
        item => item.status === "Kritis"
    ).length;


    document.getElementById("totalEquipment").textContent = total;

    document.getElementById("goodEquipment").textContent = good;

    document.getElementById("inspectionEquipment").textContent = inspection;

    document.getElementById("criticalEquipment").textContent = critical;


    const goodPercentage = Math.round((good / total) * 100);

    const inspectionPercentage =
        Math.round((inspection / total) * 100);

    const criticalPercentage =
        Math.round((critical / total) * 100);


    document.getElementById("conditionPercentage").textContent =
        goodPercentage + "%";

    document.getElementById("goodPercentage").textContent =
        goodPercentage + "%";

    document.getElementById("inspectionPercentage").textContent =
        inspectionPercentage + "%";

    document.getElementById("criticalPercentage").textContent =
        criticalPercentage + "%";
}


// ========================================
// TABEL ALAT
// ========================================

function renderEquipment(data = equipment) {

    const table = document.getElementById("equipmentTable");

    table.innerHTML = "";


    data.forEach(item => {

        let statusClass = "good";

        if (item.status === "Perlu Periksa") {
            statusClass = "warning";
        }

        if (item.status === "Kritis") {
            statusClass = "critical";
        }


        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.id}</td>

            <td>
                <strong>${item.name}</strong>
            </td>

            <td>
                <span class="type-badge">
                    ${item.type}
                </span>
            </td>

            <td>
                ${item.usage} kali
            </td>

            <td>
                ${item.battery}%
            </td>

            <td>
                <span class="score ${statusClass}">
                    ${item.score}
                </span>
            </td>

            <td>
                <span class="status-badge ${statusClass}">
                    ${item.status}
                </span>
            </td>

            <td>
                <button
                    class="detail-button"
                    onclick="viewEquipment('${item.id}')"
                >
                    Detail →
                </button>
            </td>
        `;

        table.appendChild(row);
    });
}


// ========================================
// AKTIVITAS
// ========================================

function renderActivities() {

    const activityList =
        document.getElementById("activityList");

    activityList.innerHTML = "";


    activities.forEach(activity => {

        const item = document.createElement("div");

        item.className = "activity-item";

        item.innerHTML = `
            <div class="activity-icon">
                ${activity.icon}
            </div>

            <div class="activity-text">
                <strong>
                    ${activity.title}
                </strong>

                <span>
                    ${activity.description}
                </span>
            </div>

            <span class="activity-time">
                ${activity.time}
            </span>
        `;

        activityList.appendChild(item);
    });
}


// ========================================
// SEARCH
// ========================================

const searchInput =
    document.getElementById("searchEquipment");


searchInput.addEventListener("input", function () {

    const keyword =
        this.value.toLowerCase().trim();


    const filteredEquipment = equipment.filter(item =>

        item.id.toLowerCase().includes(keyword) ||

        item.name.toLowerCase().includes(keyword) ||

        item.type.toLowerCase().includes(keyword) ||

        item.status.toLowerCase().includes(keyword)

    );


    renderEquipment(filteredEquipment);
});


// ========================================
// DETAIL ALAT
// ========================================

function viewEquipment(id) {

    const item = equipment.find(
        equipmentItem => equipmentItem.id === id
    );


    if (!item) {
        return;
    }


    alert(
        `Detail Alat\n\n` +

        `ID: ${item.id}\n` +
        `Nama: ${item.name}\n` +
        `Jenis: ${item.type}\n` +
        `Penggunaan: ${item.usage} kali\n` +
        `Baterai: ${item.battery}%\n` +
        `Kalibrasi: ${item.calibration} hari lagi\n` +
        `Skor Kondisi: ${item.score}\n` +
        `Status: ${item.status}`
    );
}


// ========================================
// TAMBAH ALAT
// ========================================

document
    .getElementById("addEquipmentButton")
    .addEventListener("click", function () {

        alert(
            "Form Tambah Alat akan dibuat pada tahap berikutnya."
        );

    });


// ========================================
// FILTER
// ========================================

document
    .getElementById("filterButton")
    .addEventListener("click", function () {

        alert(
            "Fitur filter akan digunakan untuk menyaring alat berdasarkan jenis dan status."
        );

    });


// ========================================
// MOBILE SIDEBAR
// ========================================

const mobileMenu =
    document.getElementById("mobileMenu");

const sidebar =
    document.getElementById("sidebar");


mobileMenu.addEventListener("click", function () {

    sidebar.classList.toggle("show");

});


// ========================================
// INITIALIZATION
// ========================================

updateStatistics();

renderEquipment();

renderActivities();