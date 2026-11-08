const bcrypt = require("bcryptjs");
const db = require("./config/db");

const name = "Admin";
const email = "admin@daylineedshop.com";
const password = "Admin@123";
const phone = "";
const address = "";

const hashedPassword = bcrypt.hashSync(password, 10);

try {
    const existingAdmin = db.prepare(`
        SELECT id
        FROM users
        WHERE email = ?
    `).get(email);

    if (existingAdmin) {
        console.log("Admin account already exists.");
        process.exit();
    }

    const result = db.prepare(`
        INSERT INTO users
        (name, email, password, phone, address, role)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(
        name,
        email,
        hashedPassword,
        phone,
        address,
        "admin"
    );

    console.log("Admin created successfully!");
    console.log("Admin ID:", result.lastInsertRowid);
    console.log("Email:", email);
    console.log("Password:", password);

} catch (error) {
    console.error("Admin creation error:", error.message);
}