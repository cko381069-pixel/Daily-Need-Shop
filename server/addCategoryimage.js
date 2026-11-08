const db = require("./config/db");

// =========================
// ADD IMAGE COLUMN TO CATEGORIES
// =========================

const columns = db
    .prepare("PRAGMA table_info(categories)")
    .all();

const imageColumnExists =
    columns.some(function (column) {
        return column.name === "image";
    });

if (!imageColumnExists) {

    db.prepare(`
        ALTER TABLE categories
        ADD COLUMN image TEXT
    `).run();

    console.log(
        "Category image column added successfully!"
    );

} else {

    console.log(
        "Category image column already exists."
    );
}

console.log("\nCategories table columns:\n");

console.table(
    db.prepare(`
        PRAGMA table_info(categories)
    `).all()
);

db.close();