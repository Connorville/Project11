// ===============================
// DATA ALAT
// ===============================

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


// ===============================
// AMBIL ID DARI URL
// Contoh:
// equipment-detail.html?id=MD-2026-001
// ===============================

const params = new URLSearchParams(window.location.search);

const equipmentId = params.get("id") || "MD-2026-001";

const selectedEquipment = equipment.find(
    item => item.id === equipmentId
);


// ===============================
// ELEMENT
// ===============================

const equipmentName = document.getElementById("equipmentName");
const equipmentIdElement = document.getElementById("equipmentId");
const equipmentType = document.getElementById("equipmentType");
const equipmentStatus = document.getElementById("equipmentStatus");

const breadcrumbName = document.getElementById("breadcrumbName");

const scoreValue = document.getElementById("scoreValue");
const batteryValue = document.getElementById("batteryValue");
const usageValue = document.getElementById("usageValue");
const calibrationValue = document.getElementById("calibrationValue");

const circleScore = document.getElementById("circleScore");
const scorePercent = document.getElementById("scorePercent");
const scoreProgress = document.getElementById("scoreProgress");

const conditionTitle = document.getElementById("conditionTitle");
const conditionDescription = document.getElementById("conditionDescription");

const infoName = document.getElementById("infoName");
const infoId = document.getElementById("infoId");
const infoCategory = document.getElementById("infoCategory");
const infoStatus = document.getElementById("infoStatus");
const infoUsage = document.getElementById("infoUsage");

const maintenanceDate = document.getElementById("maintenanceDate");
const maintenanceText = document.getElementById("maintenanceText");


// ===============================
// TAMPILKAN DATA
// ===============================

function renderEquipment() {

    if (!selectedEquipment) {
        document.title = "Alat Tidak Ditemukan | MediTrackPRO";

        equipmentName.textContent = "Alat Tidak Ditemukan";
        equipmentIdElement.textContent = "-";
        equipmentType.textContent = "-";

        equipmentStatus.textContent = "Tidak ditemukan";

        conditionTitle.textContent = "Data tidak tersedia";
        conditionDescription.textContent =
            "Data alat yang dipilih tidak ditemukan.";

        return;
    }


    // Header
    equipmentName.textContent = selectedEquipment.name;
    equipmentIdElement.textContent = selectedEquipment.id;
    equipmentType.textContent = selectedEquipment.type;

    breadcrumbName.textContent = selectedEquipment.name;

    document.title =
        `${selectedEquipment.name} | MediTrackPRO`;


    // Status
    equipmentStatus.textContent =
        selectedEquipment.status;

    infoStatus.textContent =
        selectedEquipment.status;


    // Tambahkan class status
    equipmentStatus.classList.remove(
        "status-warning",
        "status-critical"
    );

    if (selectedEquipment.status === "Perlu Periksa") {
        equipmentStatus.classList.add("status-warning");
    }

    if (selectedEquipment.status === "Kritis") {
        equipmentStatus.classList.add("status-critical");
    }


    // Statistics
    scoreValue.textContent =
        `${selectedEquipment.score}%`;

    batteryValue.textContent =
        `${selectedEquipment.battery}%`;

    usageValue.textContent =
        `${selectedEquipment.usage} jam`;

    calibrationValue.textContent =
        `${selectedEquipment.calibration} hari`;


    // Score
    circleScore.textContent =
        selectedEquipment.score;

    scorePercent.textContent =
        `${selectedEquipment.score}%`;

    scoreProgress.style.width =
        `${selectedEquipment.score}%`;


    // Condition
    updateCondition();


    // Information
    infoName.textContent =
        selectedEquipment.name;

    infoId.textContent =
        selectedEquipment.id;

    infoCategory.textContent =
        selectedEquipment.type;

    infoUsage.textContent =
        `${selectedEquipment.usage} jam`;


    // Maintenance
    updateMaintenance();
}


// ===============================
// UPDATE CONDITION
// ===============================

function updateCondition() {

    if (selectedEquipment.status === "Baik") {

        conditionTitle.textContent = "Kondisi Baik";

        conditionDescription.textContent =
            "Alat dalam kondisi baik dan dapat digunakan untuk operasional.";

    } else if (selectedEquipment.status === "Perlu Periksa") {

        conditionTitle.textContent = "Perlu Pemeriksaan";

        conditionDescription.textContent =
            "Alat masih dapat digunakan, tetapi disarankan melakukan pemeriksaan.";

    } else {

        conditionTitle.textContent = "Kondisi Kritis";

        conditionDescription.textContent =
            "Alat membutuhkan pemeriksaan segera sebelum digunakan kembali.";
    }
}


// ===============================
// UPDATE MAINTENANCE
// ===============================

function updateMaintenance() {

    const days = selectedEquipment.calibration;

    const date = new Date();

    date.setDate(date.getDate() + days);

    const options = {
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    maintenanceDate.textContent =
        date.toLocaleDateString("id-ID", options);

    maintenanceText.textContent =
        `${days} hari lagi`;
}


// ===============================
// BACK BUTTON
// ===============================

document.getElementById("backButton").addEventListener(
    "click",
    () => {
        window.location.href = "equipment.html";
    }
);


// ===============================
// MAINTENANCE BUTTON
// ===============================

document.getElementById("maintenanceButton").addEventListener(
    "click",
    () => {
        window.location.href = "maintenance.html";
    }
);


// ===============================
// SIMULATION
// ===============================

document.getElementById("simulationButton").addEventListener(
    "click",
    () => {

        alert(
            `Simulasi ${selectedEquipment.name}\n\n` +
            "Fitur simulasi penggunaan akan dikembangkan pada tahap berikutnya."
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

menuButton.addEventListener("click", () => {
    sidebar.classList.toggle("show");
});


// ===============================
// PLACEHOLDER MENU
// ===============================

document.getElementById("maintenanceLink")
    .addEventListener("click", (event) => {

        event.preventDefault();

        alert(
            "Halaman Maintenance akan dibuat pada langkah berikutnya."
        );

    });


document.getElementById("simulationLink")
    .addEventListener("click", (event) => {

        event.preventDefault();

        alert(
            "Halaman Simulasi akan dibuat pada langkah berikutnya."
        );

    });


document.getElementById("settingsLink")
    .addEventListener("click", (event) => {

        event.preventDefault();

        alert(
            "Halaman Pengaturan akan dibuat pada langkah berikutnya."
        );

    });


// ===============================
// INIT
// ===============================

renderEquipment();