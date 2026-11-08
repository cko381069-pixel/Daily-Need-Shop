 const db = require("../config/db");

const {
    createOrder,
    getOrderById,
    getAllOrders,
    getOrdersByUserId,
    createOrderItem,
    getOrderItems,
    createPayment,
    updateOrderStatus
} = require("../models/Orers");


// =========================
// CREATE ORDER
// =========================

const addOrder = (req, res) => {

    try {

        const {
            user_id,
            total_amount,
            shipping_address,
            items,
            payment_method
        } = req.body;


        // -------------------------
        // VALIDATION
        // -------------------------

        if (
            !total_amount ||
            !items ||
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Total amount and order items are required"
            });

        }


        // -------------------------
        // CREATE ORDER
        // -------------------------

        const createOrderTransaction = db.transaction(() => {

            const orderResult = createOrder.run(
                user_id || null,
                Number(total_amount),
                "pending",
                "pending",
                shipping_address || null
            );


            const orderId =
                orderResult.lastInsertRowid;


            // -------------------------
            // CREATE ORDER ITEMS
            // -------------------------

            items.forEach((item) => {

                createOrderItem.run(
                    orderId,
                    Number(item.product_id),
                    Number(item.quantity),
                    Number(item.price)
                );

            });


            // -------------------------
            // CREATE PAYMENT
            // -------------------------

            createPayment.run(
                orderId,
                Number(total_amount),
                payment_method || "cash",
                "pending",
                null
            );


            return orderId;

        });


        const orderId =
            createOrderTransaction();


        // -------------------------
        // GET CREATED ORDER
        // -------------------------

        const order =
            getOrderById.get(orderId);

        const orderItems =
            getOrderItems.all(orderId);


        // -------------------------
        // RESPONSE
        // -------------------------

        res.status(201).json({

            success: true,

            message: "Order created successfully",

            order: {
                ...order,
                items: orderItems
            }

        });


    } catch (error) {

        console.error(
            "Create order error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

};


// =========================
// GET USER ORDERS
// =========================

const getOrders = (req, res) => {

    try {

        const userId =
            Number(req.query.user_id);


        // -------------------------
        // CHECK USER ID
        // -------------------------

        if (!userId) {

            return res.status(400).json({

                success: false,

                message: "User ID is required"

            });

        }


        // -------------------------
        // GET USER ORDERS
        // -------------------------

        const orders =
            getOrdersByUserId.all(userId);


        // -------------------------
        // RESPONSE
        // -------------------------

        res.json({

            success: true,

            count: orders.length,

            orders

        });


    } catch (error) {

        console.error(
            "Get user orders error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message: "Server error"

        });

    }

};


// =========================
// GET SINGLE ORDER
// =========================

const getOrder = (req, res) => {

    try {

        const order =
            getOrderById.get(req.params.id);


        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found"

            });

        }


        const items =
            getOrderItems.all(req.params.id);


        res.json({

            success: true,

            order: {

                ...order,

                items

            }

        });


    } catch (error) {

        console.error(
            "Get order error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message: "Server error"

        });

    }

};


// =========================
// GET ALL ORDERS - ADMIN
// =========================

const getAllOrdersAdmin = (req, res) => {

    try {

        const orders =
            getAllOrders.all();

        res.json({

            success: true,

            count: orders.length,

            orders

        });

    } catch (error) {

        console.error(
            "Get all orders error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message: "Server error"

        });

    }

};


// =========================
// UPDATE ORDER STATUS - ADMIN
// =========================

const updateOrderStatusAdmin = (req, res) => {

    try {

        const orderId =
            Number(req.params.id);

        const {
            status
        } = req.body;


        // -------------------------
        // VALIDATION
        // -------------------------

        if (!orderId) {

            return res.status(400).json({

                success: false,

                message: "Order ID is required"

            });

        }


        if (!status) {

            return res.status(400).json({

                success: false,

                message: "Order status is required"

            });

        }


        // -------------------------
        // ALLOWED STATUS
        // -------------------------

        const allowedStatuses = [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ];


        if (
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid order status"

            });

        }


        // -------------------------
        // CHECK ORDER
        // -------------------------

        const existingOrder =
            getOrderById.get(orderId);


        if (!existingOrder) {

            return res.status(404).json({

                success: false,

                message: "Order not found"

            });

        }


        // -------------------------
        // UPDATE STATUS
        // -------------------------

        updateOrderStatus.run(
            status,
            orderId
        );


        // -------------------------
        // GET UPDATED ORDER
        // -------------------------

        const updatedOrder =
            getOrderById.get(orderId);


        // -------------------------
        // RESPONSE
        // -------------------------

        res.json({

            success: true,

            message:
                "Order status updated successfully",

            order: updatedOrder

        });


    } catch (error) {

        console.error(
            "Update order status error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message: "Server error"

        });

    }

};


// =========================
// EXPORT
// =========================

module.exports = {

    addOrder,
    getOrders,
    getOrder,
    getAllOrdersAdmin,
    updateOrderStatusAdmin

};