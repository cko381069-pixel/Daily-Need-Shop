 const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productsRoutes = require("./routes/productsRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

const PORT = process.env.PORT || 5000;


// =========================
// MIDDLEWARE
// =========================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// =========================
// STATIC UPLOADS
// =========================

const path = require("path");

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// =========================
// API ROUTES
// =========================

// Authentication
app.use(
    "/api/auth",
    authRoutes
);

// Products
app.use(
    "/api/products",
    productsRoutes
);

// Orders
app.use(
    "/api/orders",
    orderRoutes
);

// Admin Dashboard
app.use(
    "/api/admin/dashboard",
    dashboardRoutes
);

// Categories
app.use(
    "/api/categories",
    categoryRoutes
);

// Users / Customers
app.use(
    "/api/users",
    userRoutes
);


// =========================
// HOME / API STATUS
// =========================

app.get("/", (req, res) => {

    res.json({

        success: true,

        message: "Dayli Need Shop API is running!",

        database: "SQLite connected"

    });

});


// =========================
// START SERVER
// =========================

app.listen(PORT, () => {

    console.log(
        `Dayli Need Shop server running on http://localhost:${PORT}`
    );

});