const db = require("./config/db");


// =========================
// CREATE CATEGORIES
// =========================

const categories = [

    {
        name: "Vegetables",
        description: "Fresh vegetables"
    },

    {
        name: "Fruits",
        description: "Fresh fruits"
    },

    {
        name: "Rice",
        description: "Rice and grains"
    },

    {
        name: "Oil",
        description: "Cooking oils"
    },

    {
        name: "Dal",
        description: "Dal and pulses"
    },

    {
        name: "Masalas",
        description: "Spices and masalas"
    },

    {
        name: "Snacks",
        description: "Snacks and packaged foods"
    }

];


// =========================
// INSERT CATEGORY
// =========================

const insertCategory = db.prepare(`
    INSERT INTO categories
    (name, description)
    SELECT ?, ?
    WHERE NOT EXISTS (
        SELECT 1
        FROM categories
        WHERE name = ?
    )
`);


// =========================
// CREATE ALL CATEGORIES
// =========================

for (const category of categories) {

    insertCategory.run(
        category.name,
        category.description,
        category.name
    );

}


// =========================
// SHOW CATEGORIES
// =========================

const allCategories = db.prepare(`
    SELECT id, name, description
    FROM categories
    ORDER BY id ASC
`).all();


console.log("\nCategories in database:\n");

console.table(allCategories);

console.log("\nCategories created successfully!\n");


// =========================
// CLOSE DATABASE
// =========================

db.close();