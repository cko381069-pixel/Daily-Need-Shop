const db = require("../config/db");

// =========================
// CREATE PRODUCT
// =========================

const createProduct = db.prepare(`
    INSERT INTO products
    (category_id, name, description, price, image, stock)
    VALUES (?, ?, ?, ?, ?, ?)
`);


// =========================
// GET ALL PRODUCTS
// =========================

const getAllProducts = db.prepare(`
    SELECT
        products.id,
        products.name,
        products.description,
        products.price,
        products.image,
        products.stock,
        products.category_id,
        categories.name AS category_name,
        products.created_at
    FROM products
    LEFT JOIN categories
        ON products.category_id = categories.id
    ORDER BY products.id DESC
`);


// =========================
// GET PRODUCT BY ID
// =========================

const getProductById = db.prepare(`
    SELECT
        products.id,
        products.name,
        products.description,
        products.price,
        products.image,
        products.stock,
        products.category_id,
        categories.name AS category_name,
        products.created_at
    FROM products
    LEFT JOIN categories
        ON products.category_id = categories.id
    WHERE products.id = ?
`);


// =========================
// UPDATE PRODUCT
// =========================

const updateProduct = db.prepare(`
    UPDATE products
    SET
        category_id = ?,
        name = ?,
        description = ?,
        price = ?,
        image = ?,
        stock = ?
    WHERE id = ?
`);


// =========================
// DELETE PRODUCT
// =========================

const deleteProduct = db.prepare(`
    DELETE FROM products
    WHERE id = ?
`);


module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};