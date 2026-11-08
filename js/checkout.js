const CHECKOUT_CART_KEY = "dayliCart";
const CHECKOUT_ORDERS_KEY = "dayliOrders";

let checkoutDiscount = 0;

// ===============================
// Get Cart
// ===============================
function getCheckoutCart() {
    try {
        const cart = JSON.parse(localStorage.getItem(CHECKOUT_CART_KEY));
        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        console.error("Cart error:", error);
        return [];
    }
}

// ===============================
// Save Orders
// ===============================
function getCheckoutOrders() {
    try {
        const orders = JSON.parse(localStorage.getItem(CHECKOUT_ORDERS_KEY));
        return Array.isArray(orders) ? orders : [];
    } catch (error) {
        console.error("Orders error:", error);
        return [];
    }
}

function saveCheckoutOrders(orders) {
    localStorage.setItem(CHECKOUT_ORDERS_KEY, JSON.stringify(orders));
}

// ===============================
// Price Format
// ===============================
function checkoutPrice(amount) {
    return "฿" + Number(amount || 0).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

// ===============================
// Calculate Cart
// ===============================
function getCheckoutSubtotal(cart) {
    return cart.reduce((total, item) => {
        return total +
            (Number(item.price) || 0) *
            (Number(item.quantity) || 0);
    }, 0);
}

function getCheckoutShipping(subtotal) {
    return 0;
}

function getCheckoutTax(subtotal) {
    return 0 ;
}

// ===============================
// Display Checkout Items
// ===============================
function displayCheckoutItems() {
    const cart = getCheckoutCart();
    const container = document.getElementById("checkoutItems");

    if (!container) return;

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `
            <p class="empty-checkout">
                Your cart is empty.
            </p>
        `;
        updateCheckoutSummary();
        return;
    }

    cart.forEach(item => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        const total = price * quantity;

        const itemElement = document.createElement("div");

        itemElement.className = "checkout-item";

        itemElement.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <small>Qty: ${quantity}</small>
            </div>

            <span>${checkoutPrice(total)}</span>
        `;

        container.appendChild(itemElement);
    });

    updateCheckoutSummary();
}

// ===============================
// Update Summary
// ===============================
function updateCheckoutSummary() {
    const cart = getCheckoutCart();

    const subtotal = getCheckoutSubtotal(cart);
    const shipping = getCheckoutShipping(subtotal);
    const tax = getCheckoutTax(subtotal);

    const discount = checkoutDiscount;

    const total = Math.max(
        0,
        subtotal + shipping + tax - discount
    );

    const subtotalElement =
        document.getElementById("checkoutSubtotal");

    const shippingElement =
        document.getElementById("checkoutShipping");

    const taxElement =
        document.getElementById("checkoutTax");

    const totalElement =
        document.getElementById("checkoutTotal");

    if (subtotalElement) {
        subtotalElement.textContent =
            checkoutPrice(subtotal);
    }

    if (shippingElement) {
        shippingElement.textContent =
            checkoutPrice(shipping);
    }

    if (taxElement) {
        taxElement.textContent =
            checkoutPrice(tax);
    }

    if (totalElement) {
        totalElement.textContent =
            checkoutPrice(total);
    }
}

// ===============================
// Coupon
// ===============================
function applyCoupon() {
    const couponInput =
        document.getElementById("couponCode");

    if (!couponInput) return;

    const code = couponInput.value
        .trim()
        .toUpperCase();

    const cart = getCheckoutCart();
    const subtotal = getCheckoutSubtotal(cart);

    if (subtotal <= 0) {
        alert("Your cart is empty.");
        return;
    }

    if (code === "SAVE10") {

        checkoutDiscount = subtotal * 0.10;

        alert(
            "Coupon applied successfully! You saved " +
            checkoutPrice(checkoutDiscount)
        );

    } else if (code === "") {

        checkoutDiscount = 0;

        alert("Please enter a coupon code.");

    } else {

        checkoutDiscount = 0;

        alert(
            "Invalid coupon code."
        );
    }

    updateCheckoutSummary();
}

 // ===============================
// Place Order
// ===============================
async function placeCheckoutOrder(event) {

    event.preventDefault();

    const cart = getCheckoutCart();

    if (cart.length === 0) {
        alert("Your cart is empty. Please add products first.");
        window.location.href = "products.html";
        return;
    }

    const name =
        document.getElementById("fullName")?.value.trim();

    const phone =
        document.getElementById("phone")?.value.trim();

    const email =
        document.getElementById("email")?.value.trim();

    const address =
        document.getElementById("address")?.value.trim();

    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        )?.value;

    if (!name || !phone || !email || !address) {
        alert("Please fill in all customer details.");
        return;
    }

    if (!payment) {
        alert("Please select a payment method.");
        return;
    }

    const subtotal = getCheckoutSubtotal(cart);
    const shipping = getCheckoutShipping(subtotal);
    const tax = getCheckoutTax(subtotal);
    const discount = checkoutDiscount;

    const total = Math.max(
        0,
        subtotal + shipping + tax - discount
    );

    // Get logged-in user ID if available
    let userId = null;

    try {
        const savedUser =
            JSON.parse(localStorage.getItem("dayliUser"));

        if (savedUser && savedUser.id) {
            userId = Number(savedUser.id);
        }
    } catch (error) {
        console.warn("User data not found.");
    }

    // Convert cart items to backend format
    const orderItems = cart.map(item => ({
        product_id: Number(item.id),
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0
    }));

    // ===============================
    // Send Order To Backend
    // ===============================

    try {

        const response = await fetch(
            "http://localhost:5000/api/orders",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    user_id: userId,
                    total_amount: total,
                    shipping_address: address,
                    payment_method: payment,
                    items: orderItems
                })
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Order could not be created."
            );
        }

        // Backend Order ID
        const backendOrder = data.order;

        // ===============================
        // Save Frontend Order
        // ===============================

        const newOrder = {
            id: backendOrder.id,

            date: new Date().toLocaleDateString("en-GB"),

            customer: {
                name: name,
                phone: phone,
                email: email,
                address: address
            },

            payment: payment,

            items: cart,

            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            discount: discount,
            total: total,

            status: backendOrder.status || "pending"
        };

        const orders = getCheckoutOrders();

        orders.push(newOrder);

        saveCheckoutOrders(orders);

        // Clear cart
        localStorage.removeItem(CHECKOUT_CART_KEY);

        alert(
            "Order placed successfully!\n\n" +
            "Order ID: #" + backendOrder.id
        );

        // Go to My Orders
        window.location.href = "orders.html";

    } catch (error) {

        console.error("Order API error:", error);

        alert(
            "Unable to place order.\n\n" +
            "Please make sure the Dayli Need Shop server is running."
        );
    }
}

// ===============================
// Initialize Checkout
// ===============================
document.addEventListener("DOMContentLoaded", function () {

    displayCheckoutItems();

    const checkoutForm =
        document.querySelector(".checkout-form");

    if (checkoutForm) {
        checkoutForm.addEventListener(
            "submit",
            placeCheckoutOrder
        );
    }

});