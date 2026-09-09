document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil data profil dari localStorage
    const savedProfile = localStorage.getItem("mediTrack_profile");
    let profile = savedProfile ? JSON.parse(savedProfile) : {
        name: "Administrator",
        role: "Monitoring Staff",
        email: "admin@meditrack.id"
    };

    // 2. Ambil data notifikasi dari localStorage
    const savedNotif = localStorage.getItem("mediTrack_notifConfig");
    let notifConfig = savedNotif ? JSON.parse(savedNotif) : {
        threshold: "Perlu Perbaikan",
        inApp: true,
        email: true
    };

    // DOM Elements Profil
    const userNameInput = document.getElementById("userName");
    const userRoleInput = document.getElementById("userRole");
    const userEmailInput = document.getElementById("userEmail");
    const newPasswordInput = document.getElementById("newPassword");
    
    const sidebarName = document.getElementById("sidebarName");
    const sidebarRole = document.getElementById("sidebarRole");
    const sidebarAvatar = document.getElementById("sidebarAvatar");
    const topAvatar = document.getElementById("topAvatar");

    // DOM Elements Notifikasi
    const alertThreshold = document.getElementById("alertThreshold");
    const notifyInApp = document.getElementById("notifyInApp");
    const notifyEmail = document.getElementById("notifyEmail");

    // Fungsi Render UI Profil & Avatar
    function applyProfileToUI() {
        if (userNameInput) userNameInput.value = profile.name;
        if (userRoleInput) userRoleInput.value = profile.role;
        if (userEmailInput) userEmailInput.value = profile.email;

        // Update teks di sidebar kiri bawah
        if (sidebarName) sidebarName.textContent = profile.name;
        if (sidebarRole) sidebarRole.textContent = profile.role;
        
        // Update inisial nama pada Avatar
        const initial = profile.name ? profile.name.trim().charAt(0).toUpperCase() : "A";
        if (sidebarAvatar) sidebarAvatar.textContent = initial;
        if (topAvatar) topAvatar.textContent = initial;
    }

    // Fungsi Render UI Notifikasi
    function applyNotifToUI() {
        if (alertThreshold) alertThreshold.value = notifConfig.threshold;
        if (notifyInApp) notifyInApp.checked = notifConfig.inApp;
        if (notifyEmail) notifyEmail.checked = notifConfig.email;
    }

    // Eksekusi Tampilan Awal
    applyProfileToUI();
    applyNotifToUI();

    // Event Form Profil
    const profileForm = document.getElementById("profileForm");
    if (profileForm) {
        profileForm.onsubmit = (e) => {
            e.preventDefault();

            profile.name = userNameInput.value.trim();
            profile.role = userRoleInput.value.trim();
            profile.email = userEmailInput.value.trim();

            localStorage.setItem("mediTrack_profile", JSON.stringify(profile));

            // Perbarui UI seketika
            applyProfileToUI();

            if (newPasswordInput && newPasswordInput.value.trim() !== "") {
                alert("Profil dan Kata Sandi berhasil diperbarui!");
                newPasswordInput.value = "";
            } else {
                alert("Profil berhasil diperbarui!");
            }
        };
    }

    // Event Form Notifikasi
    const notificationForm = document.getElementById("notificationForm");
    if (notificationForm) {
        notificationForm.onsubmit = (e) => {
            e.preventDefault();

            notifConfig.threshold = alertThreshold.value;
            notifConfig.inApp = notifyInApp.checked;
            notifConfig.email = notifyEmail.checked;

            localStorage.setItem("mediTrack_notifConfig", JSON.stringify(notifConfig));
            alert("Konfigurasi notifikasi berhasil disimpan!");
        };
    }
});