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

async function getBrandByName(brandname) {

}

async function getCategoryByName(categoryName) {
    const { rows } = await pool.query("SELECT * FROM categories WHERE name = ($1)", [categoryName])
    return rows;
}

async function createItem(category, brand, model, colour, description, price, image, image_alt) {

}

async function createBrand(brandName, website) {
    await pool.query("INSERT into brands (name, website) VALUES ($1, $2)", [brandName, website]);
    console.log('brand added')
}

async function createCategory(categoryName) {
    await pool.query("INSERT into categories (name) VALUES ($1)", [categoryName]);
    console.log('category added')
}

module.exports = {
    getAllItems,
    getAllBrands,
    getAllCategories,
    getItem,
    getBrand,
    getBrandByName,
    getCategory,
    getCategoryByName,
    createItem,
    createBrand,
    createCategory,
    
}