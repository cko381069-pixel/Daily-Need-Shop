 const ORDERS_STORAGE_KEY = "dayliOrders";

let backendOrders = [];


// ===============================
// Format Price
// ===============================
function orderPrice(amount) {

    return "฿" + Number(amount || 0).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

}


// ===============================
// Format Date
// ===============================
function formatOrderDate(dateValue) {

    if (!dateValue) {
        return "-";
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
        return dateValue;
    }

    return date.toLocaleDateString("en-GB");

}


// ===============================
// Get Backend Orders
// ===============================
async function getBackendOrders() {

    try {

        // ===============================
        // Get Logged-in User
        // ===============================

        const savedUser =
            JSON.parse(
                localStorage.getItem("dayliUser")
            );


        // ===============================
        // Check Login
        // ===============================

        if (!savedUser || !savedUser.id) {

            alert(
                "Please login to view your orders."
            );

            window.location.href =
                "login.html";

            return [];

        }


        // ===============================
        // Get Only This User's Orders
        // ===============================

        const response = await fetch(
            `http://localhost:5000/api/orders?user_id=${savedUser.id}`
        );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to load orders."
            );

        }


        backendOrders =
            Array.isArray(data.orders)
                ? data.orders
                : [];


        return backendOrders;


    } catch (error) {

        console.error(
            "Unable to load backend orders:",
            error
        );

        return [];

    }

}


// ===============================
// Display Orders
// ===============================
async function displayOrders() {

    const tableBody =
        document.querySelector(
            ".orders-table tbody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = `
        <tr>
            <td colspan="6" class="empty-orders">
                Loading orders...
            </td>
        </tr>
    `;


    const orders =
        await getBackendOrders();


    tableBody.innerHTML = "";


    // ===============================
    // No Orders
    // ===============================

    if (orders.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-orders">

                    <h3>No orders found</h3>

                    <p>
                        You haven't placed any orders yet.
                    </p>

                    <a
                        href="products.html"
                        class="btn">
                        Start Shopping
                    </a>

                </td>
            </tr>
        `;

        return;
    }


    // ===============================
    // Latest Order First
    // ===============================

    const reversedOrders =
        [...orders].reverse();


    reversedOrders.forEach(order => {

        const row =
            document.createElement("tr");


        const status =
            String(
                order.status || "pending"
            ).toLowerCase();


        row.innerHTML = `

            <td>
                #${order.id}
            </td>

            <td>
                ${formatOrderDate(
                    order.created_at
                )}
            </td>

            <td>
                ${orderPrice(
                    order.total_amount
                )}
            </td>

            <td>

                <span class="status ${status}">
                    ${order.status || "Pending"}
                </span>

            </td>

            <td>

                <button
                    type="button"
                    class="btn view-order-btn"
                    data-id="${order.id}">
                    View
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });


    initializeOrderButtons();

}


// ===============================
// View Order Buttons
// ===============================
function initializeOrderButtons() {

    document
        .querySelectorAll(".view-order-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const orderId =
                        this.dataset.id;


                    showOrderDetails(
                        orderId
                    );

                }
            );

        });

}


// ===============================
// Show Order Details
// ===============================
async function showOrderDetails(orderId) {

    try {

        const response = await fetch(
            `http://localhost:5000/api/orders/${orderId}`
        );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Order not found."
            );

        }


        const order =
            data.order;


        let itemsText = "";


        // ===============================
        // Order Products
        // ===============================

        if (
            Array.isArray(order.items) &&
            order.items.length > 0
        ) {

            order.items.forEach(item => {

                const quantity =
                    Number(item.quantity) || 1;


                const total =
                    (Number(item.price) || 0) *
                    quantity;


                itemsText +=
                    `${item.product_name} × ${quantity} = ${orderPrice(total)}\n`;

            });

        } else {

            itemsText =
                "No products found.";

        }


        // ===============================
        // Order Details
        // ===============================

        alert(

            "ORDER DETAILS\n\n" +

            "Order ID: #" +
            order.id +
            "\n" +

            "Date: " +
            formatOrderDate(
                order.created_at
            ) +
            "\n" +

            "Customer: " +
            (
                order.user_name ||
                "Guest"
            ) +
            "\n" +

            "Email: " +
            (
                order.user_email ||
                "-"
            ) +
            "\n\n" +

            "Status: " +
            (
                order.status ||
                "Pending"
            ) +
            "\n" +

            "Payment Status: " +
            (
                order.payment_status ||
                "Pending"
            ) +
            "\n\n" +

            "Shipping Address:\n" +
            (
                order.shipping_address ||
                "-"
            ) +
            "\n\n" +

            "Products:\n" +
            itemsText +
            "\n" +

            "Grand Total: " +
            orderPrice(
                order.total_amount
            )

        );


    } catch (error) {

        console.error(
            "Order details error:",
            error
        );


        alert(
            "Unable to load order details."
        );

    }

}


// ===============================
// Initialize
// ===============================
document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayOrders();

    }
);