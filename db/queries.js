const pool = require('./pool');

async function getAllItems() {
    const { rows } = await pool.query(
        "SELECT I.*, B.name AS brand, C.name AS category FROM items I INNER JOIN brands B ON B.id = I.brand_id INNER JOIN categories C ON C.id = I.category_id"
    );
    return rows;
}

async function getAllBrands() {
    const { rows } = await pool.query("SELECT * FROM brands");
    return rows;
}

async function getAllCategories() {
    const { rows } = await pool.query("SELECT * FROM categories");
    return rows;
}

async function getItem(itemID) {
    const { rows } = await pool.query("SELECT I.*, B.name AS brand, C.name AS category FROM items I  INNER JOIN brands B ON B.id = I.brand_id INNER JOIN categories C ON C.id = I.category_id WHERE I.id = ($1)", [itemID]);
    return rows;
}

async function getBrand(brandID) {
    const { rows } = await pool.query("SELECT * FROM brands WHERE id = ($1)", [brandID]);
    return rows;
}

async function getCategory(categoryID) {
    const { rows } = await pool.query("SELECT * FROM categories WHERE id = ($1)", [categoryID]);
    return rows;
}

module.exports = {
    getAllItems,
    getAllBrands,
    getAllCategories,
    getItem,
    getBrand,
    getCategory
}