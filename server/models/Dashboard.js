 const db = require("../config/db");

// =========================
// DASHBOARD STATISTICS
// =========================

const getTotalProducts = db.prepare(`
    SELECT COUNT(*) AS total
    FROM products
`);

const getTotalCustomers = db.prepare(`
    SELECT COUNT(*) AS total
    FROM users
    WHERE role = 'customer'
`);

const getTotalOrders = db.prepare(`
    SELECT COUNT(*) AS total
    FROM orders
`);

const getTotalRevenue = db.prepare(`
    SELECT COALESCE(SUM(total_amount), 0) AS total
    FROM orders
    WHERE payment_status = 'paid'
`);


// =========================
// SALES OVERVIEW
// =========================

// Today's paid sales

const getTodaySales = db.prepare(`
    SELECT COALESCE(SUM(total_amount), 0) AS total
    FROM orders
    WHERE payment_status = 'paid'
    AND date(created_at) = date('now', 'localtime')
`);


// This month's paid sales

const getMonthlySales = db.prepare(`
    SELECT COALESCE(SUM(total_amount), 0) AS total
    FROM orders
    WHERE payment_status = 'paid'
    AND strftime('%Y-%m', created_at)
        = strftime('%Y-%m', 'now', 'localtime')
`);


// This year's paid sales

const getYearlySales = db.prepare(`
    SELECT COALESCE(SUM(total_amount), 0) AS total
    FROM orders
    WHERE payment_status = 'paid'
    AND strftime('%Y', created_at)
        = strftime('%Y', 'now', 'localtime')
`);


// =========================
// RECENT ORDERS
// =========================

const getRecentOrders = db.prepare(`
    SELECT
        orders.id,
        orders.total_amount,
        orders.status,
        orders.payment_status,
        orders.created_at,
        users.name AS customer_name
    FROM orders
    LEFT JOIN users
        ON orders.user_id = users.id
    ORDER BY orders.id DESC
    LIMIT 5
`);


module.exports = {

    getTotalProducts,
    getTotalCustomers,
    getTotalOrders,
    getTotalRevenue,

    getTodaySales,
    getMonthlySales,
    getYearlySales,

    getRecentOrders

};