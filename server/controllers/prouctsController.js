const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../models/Products");


// =========================
// CREATE PRODUCT
// =========================

const addProduct = (req, res) => {
    try {
        const {
            category_id,
            name,
            description,
            price,
            image,
            stock
        } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({
                success: false,
                message: "Product name and price are required"
            });
        }

        const result = createProduct.run(
            category_id || null,
            name,
            description || null,
            Number(price),
            image || null,
            Number(stock) || 0
        );

        const product = getProductById.get(result.lastInsertRowid);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (error) {
        console.error("Create product error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// =========================
// GET ALL PRODUCTS
// =========================

const getProducts = (req, res) => {
    try {
        const products = getAllProducts.all();

        res.json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        console.error("Get products error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// =========================
// GET SINGLE PRODUCT
// =========================

const getProduct = (req, res) => {
    try {
        const product = getProductById.get(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            product
        });

    } catch (error) {
        console.error("Get product error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// =========================
// UPDATE PRODUCT
// =========================

const editProduct = (req, res) => {
    try {
        const {
            category_id,
            name,
            description,
            price,
            image,
            stock
        } = req.body;

        const existingProduct = getProductById.get(req.params.id);

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        updateProduct.run(
            category_id || null,
            name,
            description || null,
            Number(price),
            image || null,
            Number(stock) || 0,
            req.params.id
        );

        const product = getProductById.get(req.params.id);

        res.json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.error("Update product error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// =========================
// DELETE PRODUCT
// =========================

const removeProduct = (req, res) => {
    try {
        const existingProduct = getProductById.get(req.params.id);

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        deleteProduct.run(req.params.id);

        res.json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error("Delete product error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    addProduct,
    getProducts,
    getProduct,
    editProduct,
    removeProduct
};