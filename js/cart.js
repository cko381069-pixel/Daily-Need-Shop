/* =========================================
   DAYLI NEED SHOP
   CART JAVASCRIPT
   File: js/cart.js
========================================= */


/* =========================================
   CART STORAGE KEY
========================================= */

const CART_STORAGE_KEY = "dayliCart";


/* =========================================
   GET CART
========================================= */

function getCartItems() {

    try {

        const cart = JSON.parse(
            localStorage.getItem(CART_STORAGE_KEY)
        );

        return Array.isArray(cart) ? cart : [];

    } catch (error) {

        console.error("Unable to read cart:", error);

        return [];

    }

}


/* =========================================
   SAVE CART
========================================= */

function saveCartItems(cart) {

    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
    );

}


/* =========================================
   FORMAT PRICE
========================================= */

function cartFormatPrice(price) {

    return "฿" + Number(price || 0).toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }
    );

}


/* =========================================
   UPDATE CART COUNT
========================================= */

function updateCartPageCount() {

    const cart = getCartItems();

    const count = cart.reduce(
        function (total, item) {

            return total + Number(item.quantity || 0);

        },
        0
    );


    document.querySelectorAll("#cartCount").forEach(
        function (element) {

            element.textContent = count;

        }
    );

}


/* =========================================
   CALCULATE SUBTOTAL
========================================= */

function calculateCartSubtotal(cart) {

    return cart.reduce(
        function (total, item) {

            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 0;

            return total + (price * quantity);

        },
        0
    );

}


/* =========================================
   SHIPPING
========================================= */

function calculateCartShipping(subtotal) {

    if (subtotal <= 0) {
        return 0;
    }

    return 0;

}


/* =========================================
   TAX
========================================= */

function calculateCartTax(subtotal) {

    return 0;

}


/* =========================================
   GRAND TOTAL
========================================= */

function calculateCartTotal(
    subtotal,
    shipping,
    tax
) {

    return subtotal + shipping + tax;

}


/* =========================================
   DISPLAY CART
========================================= */

function displayCartItems() {

    const cart = getCartItems();

    const cartTableBody =
        document.querySelector(".cart-table tbody");


    if (!cartTableBody) {
        return;
    }


    /* Clear existing hardcoded products */

    cartTableBody.innerHTML = "";


    /* Empty Cart */

    if (cart.length === 0) {

        cartTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-cart">
                    <div>
                        <h3>Your cart is empty</h3>

                        <p>
                            Add some products to your cart
                            to continue shopping.
                        </p>

                        <a href="products.html" class="btn">
                            Continue Shopping
                        </a>
                    </div>
                </td>
            </tr>
        `;

        updateCartSummary();

        return;

    }


    /* Create cart rows */

    cart.forEach(function (item) {

        const price = Number(item.price) || 0;

        const quantity =
            Number(item.quantity) || 1;

        const itemTotal =
            price * quantity;


        const row = document.createElement("tr");

        row.dataset.id = item.id;


        row.innerHTML = `

            <td class="cart-product">

                <img
                    src="${item.image || "assets/placeholder.png"}"
                    alt="${item.name}"
                >

                <span>${item.name}</span>

            </td>


            <td class="cart-price">
                ${cartFormatPrice(price)}
            </td>


            <td class="cart-quantity">

                <button
                    type="button"
                    class="quantity-btn decrease-btn"
                    data-id="${item.id}"
                >
                    −
                </button>

                <span class="quantity">
                    ${quantity}
                </span>

                <button
                    type="button"
                    class="quantity-btn increase-btn"
                    data-id="${item.id}"
                >
                    +
                </button>

            </td>


            <td class="cart-item-total">
                ${cartFormatPrice(itemTotal)}
            </td>


            <td class="cart-remove">

                <button
                    type="button"
                    class="remove-btn"
                    data-id="${item.id}"
                    title="Remove product"
                >
                    ×
                </button>

            </td>

        `;


        cartTableBody.appendChild(row);

    });


    initializeCartButtons();

    updateCartSummary();

}


/* =========================================
   QUANTITY BUTTONS
========================================= */

function initializeCartButtons() {

    /* Increase */

    document.querySelectorAll(".increase-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const productId =
                        this.dataset.id;

                    changeCartQuantity(
                        productId,
                        1
                    );

                }
            );

        });


    /* Decrease */

    document.querySelectorAll(".decrease-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const productId =
                        this.dataset.id;

                    changeCartQuantity(
                        productId,
                        -1
                    );

                }
            );

        });


    /* Remove */

    document.querySelectorAll(".remove-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const productId =
                        this.dataset.id;

                    removeCartItem(productId);

                }
            );

        });

}


/* =========================================
   CHANGE QUANTITY
========================================= */

function changeCartQuantity(
    productId,
    change
) {

    const cart = getCartItems();


    const product = cart.find(
        function (item) {

            return String(item.id) ===
                String(productId);

        }
    );


    if (!product) {
        return;
    }


    product.quantity =
        Number(product.quantity || 1) +
        change;


    /* Don't allow quantity below 1 */

    if (product.quantity < 1) {
        product.quantity = 1;
    }


    saveCartItems(cart);

    displayCartItems();

    updateCartPageCount();

}


/* =========================================
   REMOVE ITEM
========================================= */

function removeCartItem(productId) {

    let cart = getCartItems();


    cart = cart.filter(
        function (item) {

            return String(item.id) !==
                String(productId);

        }
    );


    saveCartItems(cart);

    displayCartItems();

    updateCartPageCount();

}


/* =========================================
   UPDATE SUMMARY
========================================= */

function updateCartSummary() {

    const cart = getCartItems();

    const subtotal =
        calculateCartSubtotal(cart);

    const shipping =
        calculateCartShipping(subtotal);

    const tax =
        calculateCartTax(subtotal);

    const total =
        calculateCartTotal(
            subtotal,
            shipping,
            tax
        );


    /* Try common IDs */

    const subtotalElement =
        document.getElementById("cartSubtotal");

    const shippingElement =
        document.getElementById("cartShipping");

    const taxElement =
        document.getElementById("cartTax");

    const totalElement =
        document.getElementById("cartTotal");


    if (subtotalElement) {

        subtotalElement.textContent =
            cartFormatPrice(subtotal);

    }


    if (shippingElement) {

        shippingElement.textContent =
            cartFormatPrice(shipping);

    }


    if (taxElement) {

        taxElement.textContent =
            cartFormatPrice(tax);

    }


    if (totalElement) {

        totalElement.textContent =
            cartFormatPrice(total);

    }


    /* Support existing summary without IDs */

    updateExistingSummary(
        subtotal,
        shipping,
        tax,
        total
    );

}


/* =========================================
   UPDATE EXISTING CART SUMMARY
========================================= */

function updateExistingSummary(
    subtotal,
    shipping,
    tax,
    total
) {

    const summary =
        document.querySelector(".cart-summary");


    if (!summary) {
        return;
    }


    const paragraphs =
        summary.querySelectorAll("p");


    paragraphs.forEach(function (paragraph) {

        const text =
            paragraph.textContent.toLowerCase();


        const value =
            paragraph.querySelector("span");


        if (!value) {
            return;
        }


        if (text.includes("subtotal")) {

            value.textContent =
                cartFormatPrice(subtotal);

        }


        if (text.includes("shipping")) {

            value.textContent =
                cartFormatPrice(shipping);

        }


        if (text.includes("tax")) {

            value.textContent =
                cartFormatPrice(tax);

        }

    });


    const heading =
        summary.querySelector("h3");


    if (heading) {

        const totalValue =
            heading.querySelector("span");


        if (totalValue) {

            totalValue.textContent =
                cartFormatPrice(total);

        }

    }

}


/* =========================================
   CHECKOUT BUTTON
========================================= */

function initializeCheckoutButton() {

    const checkoutLinks =
        document.querySelectorAll(
            'a[href="checkout.html"]'
        );


    checkoutLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const cart = getCartItems();


                if (cart.length === 0) {

                    event.preventDefault();

                    alert(
                        "Your cart is empty. Please add products first."
                    );

                }

            }
        );

    });

}


/* =========================================
   INITIALIZE CART PAGE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayCartItems();

        updateCartPageCount();

        initializeCheckoutButton();

    }
);