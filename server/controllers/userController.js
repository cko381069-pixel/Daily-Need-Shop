const {
    getAllUsers
} = require("../models/User");


// =========================
// GET ALL USERS - ADMIN
// =========================

const getAllUsersAdmin = (req, res) => {

    try {

        const users = getAllUsers.all();

        res.json({

            success: true,

            count: users.length,

            users

        });

    } catch (error) {

        console.error(
            "Get all users error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message: "Server error"

        });

    }

};


// =========================
// GET SINGLE CUSTOMER
// =========================

const getCustomerByIdAdmin = (req, res) => {

    try {

        const customerId =
            Number(req.params.id);

        if (!customerId) {

            return res.status(400).json({
                success: false,
                message: "Invalid customer ID"
            });

        }

        const {
            findUserById
        } = require("../models/User");

        const customer =
            findUserById.get(customerId);

        if (!customer) {

            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });

        }

        res.json({
            success: true,
            customer
        });

    } catch (error) {

        console.error(
            "Get customer error:",
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

    getAllUsersAdmin,
    getCustomerByIdAdmin

};
