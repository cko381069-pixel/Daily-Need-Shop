 // =========================
// BILLING PAGE
// =========================

document.addEventListener("DOMContentLoaded", function () {

    const params =
        new URLSearchParams(window.location.search);

    const orderId =
        params.get("order_id");

    if (!orderId) {
        showBillingError("Order ID is missing.");
        return;
    }

    loadBill(orderId);
});


// =========================
// LOAD BILL
// =========================

async function loadBill(orderId) {

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/orders/" +
                orderId
            );

        const data =
            await response.json();

        if (
            !response.ok ||
            !data.success ||
            !data.order
        ) {
            throw new Error(
                data.message ||
                "Failed to load order"
            );
        }

        displayBill(data.order);

    } catch (error) {

        console.error(
            "Load bill error:",
            error
        );

        showBillingError(
            "Failed to load bill."
        );
    }
}


// =========================
// DISPLAY BILL
// =========================

function displayBill(order) {

    const orderNumber =
        "DNS" +
        String(order.id)
            .padStart(4, "0");


    // =========================
    // BILL NUMBER
    // =========================

    setText(
        "billNumber",
        orderNumber
    );


    // =========================
    // BILL DATE
    // =========================

    setText(
        "billDate",
        order.created_at
            ? new Date(
                order.created_at
            ).toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            )
            : "-"
    );


    // =========================
    // CUSTOMER INFORMATION
    // =========================

    setText(
        "customerName",
        order.user_name ||
        "Guest Customer"
    );

    setText(
        "customerPhone",
        order.user_phone ||
        "Not available"
    );

    setText(
        "customerEmail",
        order.user_email ||
        "Not available"
    );

    setText(
        "customerAddress",
        order.shipping_address ||
        "Not available"
    );


    // =========================
    // PRODUCTS
    // =========================

    const billItems =
        document.getElementById(
            "billItems"
        );

    let subtotal = 0;


    if (
        billItems &&
        order.items &&
        order.items.length > 0
    ) {

        billItems.innerHTML =
            order.items.map(
                function (item, index) {

                    const quantity =
                        Number(
                            item.quantity || 0
                        );

                    const price =
                        Number(
                            item.price || 0
                        );

                    const lineTotal =
                        quantity * price;

                    subtotal += lineTotal;


                    return `
                        <tr>

                            <td>
                                ${index + 1}
                            </td>

                            <td>
                                ${escapeHTML(
                                    item.product_name ||
                                    "Product"
                                )}
                            </td>

                            <td>
                                ${quantity}
                            </td>

                            <td>
                                ฿${price.toFixed(2)}
                            </td>

                            <td>
                                ฿${lineTotal.toFixed(2)}
                            </td>

                        </tr>
                    `;
                }
            ).join("");

    } else if (billItems) {

        billItems.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    class="loading-cell"
                >
                    No products found.
                </td>
            </tr>
        `;
    }


    // =========================
    // SUBTOTAL
    // =========================

    setText(
        "billSubtotal",
        "฿" + subtotal.toFixed(2)
    );


    // =========================
    // DELIVERY & DISCOUNT
    // =========================

    const deliveryFeeInput =
        document.getElementById(
            "deliveryFeeInput"
        );

    const discountInput =
        document.getElementById(
            "discountInput"
        );


    // Start with 0
    if (deliveryFeeInput) {
        deliveryFeeInput.value = 0;
    }

    if (discountInput) {
        discountInput.value = 0;
    }


    // =========================
    // UPDATE TOTAL FUNCTION
    // =========================

    function updateBillTotal() {

        const deliveryFee =
            Number(
                deliveryFeeInput?.value || 0
            );

        const discount =
            Number(
                discountInput?.value || 0
            );


        const grandTotal =
            Math.max(
                0,
                subtotal +
                deliveryFee -
                discount
            );


        // Delivery Fee display
        setText(
            "deliveryFee",
            "฿" +
            deliveryFee.toFixed(2)
        );


        // Discount display
        setText(
            "billDiscount",
            "฿" +
            discount.toFixed(2)
        );


        // Grand Total
        setText(
            "grandTotal",
            "฿" +
            grandTotal.toFixed(2)
        );
    }


    // =========================
    // INPUT EVENTS
    // =========================

    if (deliveryFeeInput) {

        deliveryFeeInput.addEventListener(
            "input",
            updateBillTotal
        );
    }


    if (discountInput) {

        discountInput.addEventListener(
            "input",
            updateBillTotal
        );
    }


    // Initial calculation
    updateBillTotal();


    // =========================
    // PAYMENT
    // =========================

    setText(
        "paymentMethod",
        order.payment_method ||
        "Cash"
    );

    setText(
        "paymentStatus",
        order.payment_status ||
        "Pending"
    );
}


// =========================
// SET TEXT
// =========================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


// =========================
// ESCAPE HTML
// =========================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =========================
// BILLING ERROR
// =========================

function showBillingError(message) {

    const page =
        document.querySelector(
            ".billing-page"
        );

    if (!page) return;

    page.innerHTML = `
        <div
            style="
                text-align:center;
                padding:80px 20px;
            "
        >

            <h2>
                ${escapeHTML(message)}
            </h2>

            <p>
                Please try again.
            </p>

        </div>
    `;
}


// =========================
// PRINT BILL
// =========================

const printBillButton =
    document.getElementById(
        "printBillBtn"
    );

if (printBillButton) {

    printBillButton.addEventListener(
        "click",
        function () {

            window.print();

        }
    );
}


// =========================
// BACK TO ORDERS
// =========================

const backToOrdersButton =
    document.getElementById(
        "backToOrdersBtn"
    );

if (backToOrdersButton) {

    backToOrdersButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "orders.html";

        }
    );
}