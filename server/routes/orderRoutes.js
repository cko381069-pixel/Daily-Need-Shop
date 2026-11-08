 const express = require("express");

const {
    addOrder,
    getOrders,
    getOrder,
    getAllOrdersAdmin,
    updateOrderStatusAdmin
} = require("../controllers/orderController");

const router = express.Router();


// =========================
// CREATE NEW ORDER
// =========================

router.post(
    "/",
    addOrder
);


// =========================
// GET ALL ORDERS - ADMIN
// IMPORTANT: BEFORE /:id
// =========================

router.get(
    "/admin/all",
    getAllOrdersAdmin
);


// =========================
// UPDATE ORDER STATUS - ADMIN
// IMPORTANT: BEFORE /:id
// =========================

router.put(
    "/admin/:id/status",
    updateOrderStatusAdmin
);


// =========================
// GET USER ORDERS
// =========================

router.get(
    "/",
    getOrders
);


// =========================
// GET SINGLE ORDER
// =========================

router.get(
    "/:id",
    getOrder
);


module.exports = router;