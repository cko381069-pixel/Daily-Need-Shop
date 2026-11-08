const express = require("express");

const {
    getAllUsersAdmin,
    getCustomerByIdAdmin
} = require("../controllers/userController");

const router = express.Router();


// =========================
// GET ALL USERS - ADMIN
// =========================

router.get(
    "/admin/all",
    getAllUsersAdmin
);

// =========================
// GET SINGLE CUSTOMER
// =========================

router.get(
    "/admin/:id",
    getCustomerByIdAdmin
);

module.exports = router;