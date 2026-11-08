 const db = require("./config/db");

try {
    const columnsToAdd = [
        ["delivery_fee", "REAL NOT NULL DEFAULT 0"],
        ["discount", "REAL NOT NULL DEFAULT 0"],
        ["final_total", "REAL"]
    ];

    const existingColumns = db
        .prepare("PRAGMA table_info(orders)")
        .all()
        .map(column => column.name);

    for (const [columnName, columnType] of columnsToAdd) {
        if (!existingColumns.includes(columnName)) {
            db.exec(
                `ALTER TABLE orders ADD COLUMN ${columnName} ${columnType}`
            );
            console.log(`Added column: ${columnName}`);
        } else {
            console.log(`Already exists: ${columnName}`);
        }
    }

    db.exec(`
        UPDATE orders
        SET final_total = total_amount
        WHERE final_total IS NULL
    `);

    console.log("\nBilling database setup completed!");
} catch (error) {
    console.error("Database setup failed:", error.message);
} finally {
    db.close();
}