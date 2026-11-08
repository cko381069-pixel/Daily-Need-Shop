 const {
    getTotalProducts,
    getTotalCustomers,
    getTotalOrders,
    getTotalRevenue,
    getTodaySales,
    getMonthlySales,
    getYearlySales,
    getRecentOrders
} = require("../models/Dashboard");


// =========================
// GET DASHBOARD DATA
// =========================

const getDashboardData = (req, res) => {

    try {

        const totalProducts =
            getTotalProducts.get();

        const totalCustomers =
            getTotalCustomers.get();

        const totalOrders =
            getTotalOrders.get();

        const totalRevenue =
            getTotalRevenue.get();


        // =========================
        // SALES OVERVIEW
        // =========================

        const todaySales =
            getTodaySales.get();

        const monthlySales =
            getMonthlySales.get();

        const yearlySales =
            getYearlySales.get();


        // =========================
        // RECENT ORDERS
        // =========================

        const recentOrders =
            getRecentOrders.all();


        // =========================
        // SEND RESPONSE
        // =========================

        res.json({

            success: true,

            statistics: {

                totalProducts:
                    totalProducts.total,

                totalCustomers:
                    totalCustomers.total,

                totalOrders:
                    totalOrders.total,

                totalRevenue:
                    totalRevenue.total

            },

            salesOverview: {

                today:
                    todaySales.total,

                thisMonth:
                    monthlySales.total,

                thisYear:
                    yearlySales.total

            },

            recentOrders

        });

    } catch (error) {

        console.error(
            "Dashboard error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to load dashboard data"

        });

    }

};


module.exports = {
    getDashboardData
};