const db = require("../config/db");


// =========================
// CREATE ORDER
// =========================

const createOrder = db.prepare(`
    INSERT INTO orders
    (user_id, total_amount, status, payment_status, shipping_address)
    VALUES (?, ?, ?, ?, ?)
`);

 // =========================
// GET ORDER BY ID
// =========================

const getOrderById = db.prepare(`
    SELECT
        orders.id,
        orders.user_id,
        orders.total_amount,
        orders.status,
        orders.payment_status,
        orders.shipping_address,
        orders.created_at,

        users.name AS user_name,
        users.email AS user_email,
        users.phone AS user_phone,

        payments.method AS payment_method,
        payments.status AS payment_status_from_payment

    FROM orders

    LEFT JOIN users
        ON orders.user_id = users.id

    LEFT JOIN payments
        ON orders.id = payments.order_id

    WHERE orders.id = ?
`);

// =========================
// GET ALL ORDERS
// =========================

const getAllOrders = db.prepare(`
    SELECT
        orders.id,
        orders.user_id,
        orders.total_amount,
        orders.status,
        orders.payment_status,
        orders.shipping_address,
        orders.created_at,
        users.name AS user_name,
        users.email AS user_email
    FROM orders
    LEFT JOIN users
        ON orders.user_id = users.id
    ORDER BY orders.id DESC
`);
// =========================
// UPDATE ORDER STATUS
// =========================

const updateOrderStatus = db.prepare(`
    UPDATE orders
    SET status = ?
    WHERE id = ?
`);

const getOrdersByUserId = db.prepare(`
    SELECT
        orders.id,
        orders.user_id,
        orders.total_amount,
        orders.status,
        orders.payment_status,
        orders.shipping_address,
        orders.created_at,
        users.name AS user_name,
        users.email AS user_email
    FROM orders
    LEFT JOIN users
        ON orders.user_id = users.id
    WHERE orders.user_id = ?
    ORDER BY orders.id DESC
`);

// =========================
// CREATE ORDER ITEM
// =========================

const createOrderItem = db.prepare(`
    INSERT INTO order_items
    (order_id, product_id, quantity, price)
    VALUES (?, ?, ?, ?)
`);


// =========================
// GET ORDER ITEMS
// =========================

const getOrderItems = db.prepare(`
    SELECT
        order_items.id,
        order_items.order_id,
        order_items.product_id,
        order_items.quantity,
        order_items.price,
        products.name AS product_name,
        products.image AS product_image
    FROM order_items
    LEFT JOIN products
        ON order_items.product_id = products.id
    WHERE order_items.order_id = ?
`);


// =========================
// CREATE PAYMENT
// =========================

const createPayment = db.prepare(`
    INSERT INTO payments
    (order_id, amount, method, status, transaction_id)
    VALUES (?, ?, ?, ?, ?)
`);


module.exports = {
    createOrder,
    getOrderById,
    getAllOrders,
    getOrdersByUserId,
    createOrderItem,
    getOrderItems,
    createPayment,
    updateOrderStatus
};