 const express = require("express");

const {
    addCategory,
    getCategories,
    getCategory,
    editCategory,
    removeCategory
} = require("../controllers/categoryController");

const {
    uploadCategoryImage
} = require("../middleware/upload");

const router = express.Router();


// =========================
// CREATE CATEGORY
// =========================

router.post(
    "/",
    uploadCategoryImage.single("image"),
    addCategory
);


// =========================
// GET ALL CATEGORIES
// =========================

router.get(
    "/",
    getCategories
);


// =========================
// GET SINGLE CATEGORY
// =========================

router.get(
    "/:id",
    getCategory
);


// =========================
// UPDATE CATEGORY
// =========================

router.put(
    "/:id",
    uploadCategoryImage.single("image"),
    editCategory
);


// =========================
// DELETE CATEGORY
// =========================

router.delete(
    "/:id",
    removeCategory
);


module.exports = router;