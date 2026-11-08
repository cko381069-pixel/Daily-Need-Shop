const express = require("express");

const {
    addProduct,
    getProducts,
    getProduct,
    editProduct,
    removeProduct
} = require("../controllers/prouctsController");

const router = express.Router();


// Add Product
router.post("/", addProduct);

// Get All Products
router.get("/", getProducts);

// Get Single Product
router.get("/:id", getProduct);

// Update Product
router.put("/:id", editProduct);

// Delete Product
router.delete("/:id", removeProduct);


module.exports = router;