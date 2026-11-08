 const db = require("../config/db");

// =========================
// CATEGORY MODEL
// =========================

// CREATE CATEGORY

const createCategory = db.prepare(`
    INSERT INTO categories
    (name, description, image)
    VALUES (?, ?, ?)
`);


// GET ALL CATEGORIES

const getAllCategories = db.prepare(`
    SELECT
        id,
        name,
        description,
        image,
        created_at
    FROM categories
    ORDER BY id ASC
`);


// GET SINGLE CATEGORY

const getCategoryById = db.prepare(`
    SELECT
        id,
        name,
        description,
        image,
        created_at
    FROM categories
    WHERE id = ?
`);


// UPDATE CATEGORY

const updateCategory = db.prepare(`
    UPDATE categories
    SET
        name = ?,
        description = ?,
        image = ?
    WHERE id = ?
`);


// DELETE CATEGORY

const deleteCategory = db.prepare(`
    DELETE FROM categories
    WHERE id = ?
`);


module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};