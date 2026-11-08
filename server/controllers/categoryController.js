 const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require("../models/Category");


// =========================
// CREATE CATEGORY
// =========================

const addCategory = (req, res) => {

    try {

        const {
            name,
            description
        } = req.body;

        if (!name || !name.trim()) {

            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });

        }

        const existingCategories =
            getAllCategories.all();

        const alreadyExists =
            existingCategories.some(
                function (category) {

                    return category.name.toLowerCase() ===
                        name.trim().toLowerCase();

                }
            );

        if (alreadyExists) {

            return res.status(400).json({
                success: false,
                message: "Category already exists"
            });

        }

        const image =
            req.file
                ? req.file.filename
                : null;

        const result =
            createCategory.run(
                name.trim(),
                description
                    ? description.trim()
                    : null,
                image
            );

        const category =
            getCategoryById.get(
                result.lastInsertRowid
            );

        res.status(201).json({

            success: true,

            message:
                "Category created successfully",

            category

        });

    } catch (error) {

        console.error(
            "Create category error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Server error"

        });

    }

};


// =========================
// GET ALL CATEGORIES
// =========================

const getCategories = (req, res) => {

    try {

        const categories =
            getAllCategories.all();

        res.json({

            success: true,

            count:
                categories.length,

            categories

        });

    } catch (error) {

        console.error(
            "Get categories error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Server error"

        });

    }

};


// =========================
// GET SINGLE CATEGORY
// =========================

const getCategory = (req, res) => {

    try {

        const category =
            getCategoryById.get(
                req.params.id
            );

        if (!category) {

            return res.status(404).json({

                success: false,

                message:
                    "Category not found"

            });

        }

        res.json({

            success: true,

            category

        });

    } catch (error) {

        console.error(
            "Get category error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Server error"

        });

    }

};


// =========================
// UPDATE CATEGORY
// =========================

const editCategory = (req, res) => {

    try {

        const {
            name,
            description
        } = req.body;

        const existingCategory =
            getCategoryById.get(
                req.params.id
            );

        if (!existingCategory) {

            return res.status(404).json({

                success: false,

                message:
                    "Category not found"

            });

        }

        if (!name || !name.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Category name is required"

            });

        }

        // Keep old image if no new image is selected

        const image =
            req.file
                ? req.file.filename
                : existingCategory.image;

        updateCategory.run(

            name.trim(),

            description
                ? description.trim()
                : null,

            image,

            req.params.id

        );

        const category =
            getCategoryById.get(
                req.params.id
            );

        res.json({

            success: true,

            message:
                "Category updated successfully",

            category

        });

    } catch (error) {

        console.error(
            "Update category error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Server error"

        });

    }

};


// =========================
// DELETE CATEGORY
// =========================

const removeCategory = (req, res) => {

    try {

        const existingCategory =
            getCategoryById.get(
                req.params.id
            );

        if (!existingCategory) {

            return res.status(404).json({

                success: false,

                message:
                    "Category not found"

            });

        }

        deleteCategory.run(
            req.params.id
        );

        res.json({

            success: true,

            message:
                "Category deleted successfully"

        });

    } catch (error) {

        console.error(
            "Delete category error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Cannot delete category. It may be used by products."

        });

    }

};


// =========================
// EXPORT
// =========================

module.exports = {

    addCategory,
    getCategories,
    getCategory,
    editCategory,
    removeCategory

};