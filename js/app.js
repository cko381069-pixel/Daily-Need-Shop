 /* =========================================
   DAYLI NEED SHOP
   COMMON FRONTEND JAVASCRIPT
   File: js/app.js
========================================= */


/* =========================================
   LOCAL STORAGE KEYS
========================================= */

const CART_KEY = "dayliCart";
const ORDERS_KEY = "dayliOrders";
const USER_KEY = "dayliUser";


/* =========================================
   GET CART
========================================= */

function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem(CART_KEY));

        if (Array.isArray(cart)) {
            return cart;
        }

        return [];
    } catch (error) {
        console.error("Error reading cart:", error);
        return [];
    }
}


/* =========================================
   SAVE CART
========================================= */

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}


/* =========================================
   GET ORDERS
========================================= */

function getOrders() {
    try {
        const orders = JSON.parse(localStorage.getItem(ORDERS_KEY));

        if (Array.isArray(orders)) {
            return orders;
        }

        return [];
    } catch (error) {
        console.error("Error reading orders:", error);
        return [];
    }
}


/* =========================================
   SAVE ORDERS
========================================= */

function saveOrders(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}


/* =========================================
   CART ITEM COUNT
========================================= */

function updateCartCount() {

    const cart = getCart();

    const totalQuantity = cart.reduce(function (total, item) {
        return total + Number(item.quantity || 0);
    }, 0);

    const cartCountElements = document.querySelectorAll("#cartCount");

    cartCountElements.forEach(function (element) {
        element.textContent = totalQuantity;
    });
}


/* =========================================
   FORMAT PRICE
========================================= */

function formatPrice(amount) {

    const number = Number(amount) || 0;

    return "฿" + number.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}


/* =========================================
   GET CART SUBTOTAL
========================================= */

function getCartSubtotal() {

    const cart = getCart();

    return cart.reduce(function (total, item) {

        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;

        return total + (price * quantity);

    }, 0);
}


/* =========================================
   SHIPPING
========================================= */

function getShipping(subtotal) {

    if (subtotal <= 0) {
        return 0;
    }

    return 50;
}


/* =========================================
   TAX
========================================= */

function getTax(subtotal) {

    return subtotal * 0.08;
}


/* =========================================
   GRAND TOTAL
========================================= */

function getGrandTotal(subtotal) {

    const shipping = getShipping(subtotal);
    const tax = getTax(subtotal);

    return subtotal + shipping + tax;
}


/* =========================================
   UPDATE CART COUNT ON PAGE
========================================= */

function initializeCommonFeatures() {

    updateCartCount();

}


/* =========================================
   NEWSLETTER
========================================= */

function initializeNewsletter() {

    const newsletterForms = document.querySelectorAll(".newsletter-form");

    newsletterForms.forEach(function (form) {

        form.addEventListener("submit", function (event) {

            event.preventDefault();

            const emailInput = form.querySelector(
                'input[type="email"]'
            );

            if (!emailInput) {
                return;
            }

            const email = emailInput.value.trim();

            if (!email) {
                alert("Please enter your email address.");
                return;
            }

            alert("Thank you for subscribing!");

            emailInput.value = "";

        });

    });

}


/* =========================================
   BACK TO TOP
========================================= */

function initializeBackToTop() {

    const topButton = document.getElementById("topBtn");

    if (!topButton) {
        return;
    }

    window.addEventListener("scroll", function () {

        if (window.scrollY > 300) {
            topButton.style.display = "flex";
        } else {
            topButton.style.display = "none";
        }

    });

    topButton.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* =========================================
   ACTIVE NAVIGATION
========================================= */

function setActiveNavigation() {

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(function (link) {

        const linkPage = link
            .getAttribute("href")
            .split("/")
            .pop()
            .toLowerCase();

        link.classList.remove("active");

        if (
            linkPage === currentPage &&
            currentPage !== ""
        ) {
            link.classList.add("active");
        }

    });

}


/* =========================================
   PAGE INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeCommonFeatures();

    initializeNewsletter();

    initializeBackToTop();

    setActiveNavigation();

});