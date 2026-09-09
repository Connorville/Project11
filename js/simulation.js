// ===============================
// DATA ALAT
// ===============================

const equipmentData = {

    "MD-2026-001": {
        name: "Patient Monitor",
        type: "Diagnostik",
        battery: 87,
        usage: 128,
        score: 94
    },

    "MD-2026-002": {
        name: "Ventilator",
        type: "Pendukung Kehidupan",
        battery: 62,
        usage: 245,
        score: 76
    },

    "MD-2026-003": {
        name: "ECG Machine",
        type: "Diagnostik",
        battery: 91,
        usage: 87,
        score: 97
    },

    "MD-2026-004": {
        name: "Infusion Pump",
        type: "Pendukung Kehidupan",
        battery: 44,
        usage: 312,
        score: 61
    },

    "MD-2026-005": {
        name: "Pulse Oximeter",
        type: "Diagnostik",
        battery: 78,
        usage: 174,
        score: 89
    }

};


// ===============================
// ELEMENT
// ===============================

const equipmentSelect =
    document.getElementById("equipmentSelect");

const selectedName =
    document.getElementById("selectedName");

const selectedId =
    document.getElementById("selectedId");

const monitorName =
    document.getElementById("monitorName");

const monitorType =
    document.getElementById("monitorType");

const batteryValue =
    document.getElementById("batteryValue");

const batteryBar =
    document.getElementById("batteryBar");

const usageValue =
    document.getElementById("usageValue");

const usageBar =
    document.getElementById("usageBar");

const scoreValue =
    document.getElementById("scoreValue");

const scoreBar =
    document.getElementById("scoreBar");

const durationElement =
    document.getElementById("duration");

const simulationStatus =
    document.getElementById("simulationStatus");

const logContainer =
    document.getElementById("logContainer");


// ===============================
// STATE
// ===============================

let duration = 1;

let currentEquipment = null;


// ===============================
// LOAD EQUIPMENT
// ===============================

function loadEquipment() {

    const id =
        equipmentSelect.value;

    currentEquipment =
        equipmentData[id];

    if (!currentEquipment) return;


    selectedName.textContent =
        currentEquipment.name;

    selectedId.textContent =
        id;

    monitorName.textContent =
        currentEquipment.name;

    monitorType.textContent =
        currentEquipment.type;


    batteryValue.textContent =
        `${currentEquipment.battery}%`;

    batteryBar.style.width =
        `${currentEquipment.battery}%`;


    usageValue.textContent =
        `${currentEquipment.usage} jam`;


    const usagePercent =
        Math.min(
            (currentEquipment.usage / 500) * 100,
            100
        );

    usageBar.style.width =
        `${usagePercent}%`;


    scoreValue.textContent =
        currentEquipment.score;

    scoreBar.style.width =
        `${currentEquipment.score}%`;

}


// ===============================
// DURATION
// ===============================

document.getElementById(
    "increaseDuration"
).addEventListener(
    "click",
    () => {

        if (duration < 24) {
            duration++;
        }

        durationElement.textContent =
            duration;

    }
);


document.getElementById(
    "decreaseDuration"
).addEventListener(
    "click",
    () => {

        if (duration > 1) {
            duration--;
        }

        durationElement.textContent =
            duration;

    }
);


// ===============================
// START SIMULATION
// ===============================

document.getElementById(
    "startSimulation"
).addEventListener(
    "click",
    () => {

        if (!currentEquipment) return;


        simulationStatus.textContent =
            "Berjalan";


        simulationStatus.style.background =
            "#fef3c7";

        simulationStatus.style.color =
            "#b45309";


        const oldBattery =
            currentEquipment.battery;

        const oldUsage =
            currentEquipment.usage;

        const oldScore =
            currentEquipment.score;


        /*
         * Simulasi sederhana:
         * setiap 1 jam penggunaan
         * baterai berkurang 2%
         * skor kondisi berkurang 1 poin
         */

        const batteryDecrease =
            duration * 2;

        const scoreDecrease =
            duration;


        const newBattery =
            Math.max(
                oldBattery - batteryDecrease,
                0
            );

        const newUsage =
            oldUsage + duration;

        const newScore =
            Math.max(
                oldScore - scoreDecrease,
                0
            );


        currentEquipment.battery =
            newBattery;

        currentEquipment.usage =
            newUsage;

        currentEquipment.score =
            newScore;


        loadEquipment();


        addLog(
            `${currentEquipment.name} digunakan selama ${duration} jam.`
        );


        setTimeout(
            () => {

                simulationStatus.textContent =
                    "Selesai";

                simulationStatus.style.background =
                    "#dcfce7";

                simulationStatus.style.color =
                    "#15803d";

            },
            500
        );

    }
);


// ===============================
// RESET
// ===============================

document.getElementById(
    "resetSimulation"
).addEventListener(
    "click",
    () => {

        const id =
            equipmentSelect.value;

        const originalData = {

            "MD-2026-001": [87, 128, 94],
            "MD-2026-002": [62, 245, 76],
            "MD-2026-003": [91, 87, 97],
            "MD-2026-004": [44, 312, 61],
            "MD-2026-005": [78, 174, 89]

        };


        currentEquipment.battery =
            originalData[id][0];

        currentEquipment.usage =
            originalData[id][1];

        currentEquipment.score =
            originalData[id][2];


        duration = 1;

        durationElement.textContent =
            duration;


        simulationStatus.textContent =
            "Siap";

        simulationStatus.style.background =
            "#dcfce7";

        simulationStatus.style.color =
            "#15803d";


        loadEquipment();


        logContainer.innerHTML =
            `<div class="log-empty">
                Belum ada aktivitas simulasi.
            </div>`;

    }
);


// ===============================
// LOG
// ===============================

function addLog(message) {

    const empty =
        logContainer.querySelector(
            ".log-empty"
        );

    if (empty) {
        empty.remove();
    }


    const log =
        document.createElement("div");

    log.className =
        "log-item";

    log.textContent =
        `✓ ${message}`;


    logContainer.prepend(log);

}


// ===============================
// CLEAR LOG
// ===============================

document.getElementById(
    "clearLog"
).addEventListener(
    "click",
    () => {

        logContainer.innerHTML =
            `<div class="log-empty">
                Belum ada aktivitas simulasi.
            </div>`;

    }
);


// ===============================
// EQUIPMENT CHANGE
// ===============================

equipmentSelect.addEventListener(
    "change",
    () => {

        duration = 1;

        durationElement.textContent =
            duration;

        simulationStatus.textContent =
            "Siap";

        simulationStatus.style.background =
            "#dcfce7";

        simulationStatus.style.color =
            "#15803d";

        loadEquipment();

    }
);


// ===============================
// SIDEBAR MOBILE
// ===============================

document.getElementById(
    "menuButton"
).addEventListener(
    "click",
    () => {

        document.getElementById(
            "sidebar"
        ).classList.toggle("show");

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
// INITIALIZE
// ===============================

loadEquipment();