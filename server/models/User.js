const db = require("../config/db");

const createUser = db.prepare(`
    INSERT INTO users (name, email, password, phone, address, role)
    VALUES (?, ?, ?, ?, ?, ?)
`);

const findUserByEmail = db.prepare(`
    SELECT * FROM users
    WHERE email = ?
`);

const findUserById = db.prepare(`
    SELECT id, name, email, phone, address, role, created_at
    FROM users
    WHERE id = ?
`);
 
const getAllUsers = db.prepare(`
    SELECT
        users.id,
        users.name,
        users.email,
        users.phone,
        users.address,
        users.role,
        users.created_at,
        COUNT(orders.id) AS order_count
    FROM users
    LEFT JOIN orders
        ON orders.user_id = users.id
    GROUP BY users.id
    ORDER BY users.id DESC
`);

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    getAllUsers
};