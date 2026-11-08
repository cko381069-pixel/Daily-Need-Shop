 const express = require("express");

const {
    registerUser,
    loginUser,
    loginAdmin
} = require("../controllers/authController");

const router = express.Router();

// =========================
// REGISTER USER
// =========================

router.post("/register", registerUser);


// =========================
// LOGIN USER
// =========================

router.post("/login", loginUser);


// =========================
// ADMIN LOGIN
// =========================

router.post("/admin-login", loginAdmin);


module.exports = router;