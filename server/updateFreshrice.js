const db = require("./config/db");


// =========================
// UPDATE FRESH RICE
// =========================

const updateProduct = db.prepare(`
    UPDATE products
    SET
        category_id = ?,
        image = ?
    WHERE id = ?
`);


// Product ID 2
// Category ID 3 = Rice

const result = updateProduct.run(
    3,
    "rice.jpeg",
    2
);


// =========================
// CHECK RESULT
// =========================

console.log(
    "Rows updated:",
    result.changes
);


const product = db.prepare(`
    SELECT
        products.id,
        products.name,
        products.category_id,
        categories.name AS category_name,
        products.image,
        products.price,
        products.stock
    FROM products

    LEFT JOIN categories
        ON products.category_id = categories.id

    WHERE products.id = ?
`).get(2);


console.log("\nUpdated product:\n");

console.table(product);


db.close();