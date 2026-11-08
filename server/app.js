// ===============================
// Scroll Reveal Animation
// ===============================

const revealItems = document.querySelectorAll(
".product-card, .category-card, .feature-card, .about-card, .team-card, .contact-card, .cart-item, .card"
);

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {

    threshold: 0.15

});

revealItems.forEach((item) => {

    observer.observe(item);

});
// ===============================
// Navbar Scroll Effect
// ===============================

const navbar = document.querySelector("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        navbar.classList.add("sticky");

    } else {

        navbar.classList.remove("sticky");

    }

});
// ===============================
// Back To Top Button
// ===============================

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {

    if(window.scrollY > 300){

        topBtn.style.display = "block";

    }else{

        topBtn.style.display = "none";

    }

});

topBtn.addEventListener("click", () => {

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});
// ===============================
// Preloader
// ===============================

window.addEventListener("load", () => {

    const preloader = document.getElementById("preloader");

    preloader.style.opacity = "0";

    setTimeout(() => {

        preloader.style.display = "none";

    },500);

});
