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

module.exports = {
    getAllItems,
    getAllBrands,
    getAllCategories,
}