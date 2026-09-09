/* =========================================
   MEDI TRACK PRO
   Landing Page JavaScript
========================================= */


/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle) {

    menuToggle.addEventListener("click", function () {

        navMenu.classList.toggle("active");

    });

}


/* Close mobile menu after clicking a link */

const navLinks = document.querySelectorAll(".nav-menu a");

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        navMenu.classList.remove("active");

    });

});


/* =========================================
   START BUTTON
========================================= */

const startButton = document.getElementById("startButton");

if (startButton) {

    startButton.addEventListener("click", function () {

        alert(
            "Dashboard MediTrackPRO akan dibuka pada tahap pengembangan berikutnya."
        );

    });

}


/* =========================================
   SIMPLE SCROLL ANIMATION
========================================= */

const animatedElements = document.querySelectorAll(
    ".feature-card, .step, .about-content, .about-visual"
);

const observer = new IntersectionObserver(
    function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

            }

        });

    },
    {
        threshold: 0.15
    }
);


animatedElements.forEach(function (element) {

    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";

    observer.observe(element);

});


/* =========================================
   DASHBOARD MOCK DATA ANIMATION
========================================= */

const progressBar = document.querySelector(".progress-fill");

if (progressBar) {

    setTimeout(function () {

        progressBar.style.transition = "width 1s ease";
        progressBar.style.width = "94%";

    }, 300);

}