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

async function getBrandByName(brandName) {
    const { rows } = await pool.query("SELECT * FROM categories WHERE name = ($1)", [brandName]);
    return rows;
}

async function getCategoryByName(categoryName) {
    const { rows } = await pool.query("SELECT * FROM categories WHERE name = ($1)", [categoryName]);
    return rows;
}

async function createItem(category, brand, model, description, price, quantity, image, image_alt) {
    await pool.query("INSERT into items (category_id, brand_id, model, description, price, quantity, image, image_alt) VALUES ((SELECT id FROM categories WHERE name = $1), (SELECT id FROM brands WHERE name = $2), $3, $4, $5, $6, $7, $8)", [category, brand, model, description, price, quantity, image, image_alt]);
    console.log('item added');
}

async function createBrand(brandName, website) {
    await pool.query("INSERT into brands (name, website) VALUES ($1, $2)", [brandName, website]);
    console.log('brand added');
}

async function createCategory(categoryName) {
    await pool.query("INSERT into categories (name) VALUES ($1)", [categoryName]);
    console.log('category added');
}

async function updateItem(id, category, brand, model, description, price, quantity, image, image_alt) {
    await pool.query("UPDATE items SET category_id=(SELECT id FROM categories WHERE name = $1), brand_id=(SELECT id FROM brands WHERE name = $2), model=($3), description=($4), price=($5), quantity=($6), image=($7), image_alt=($8) WHERE id = ($9)", [category, brand, model, description, price, quantity, image, image_alt, id]);
    console.log(`${model} updated`)
}

async function updateBrand(id, name, website) {
    await pool.query("UPDATE brands SET name=($1), website=($2) WHERE id = ($3)", [name, website, id]);
    console.log(`${name} updated`);
} 

async function updateCategory(id, name) {
    await pool.query("UPDATE categories SET name=($1) WHERE id = ($2)", [name, id]);
    console.log(`${name} Category Updated`)
}

async function deleteItem(id) {
    await pool.query("DELETE FROM items WHERE id = $1", [id]);
    console.log('Item Deleted')
}

async function deleteBrand(id) {
    await pool.query("DELETE FROM brands WHERE id = $1", [id]);
    console.log('Brand Deleted')
}

async function deleteCategory(id) {
    await pool.query("DELETE FROM categories WHERE id = $1", [id]);
    console.log('Category Deleted')
}

async function getRelatedByBrand(id) {
    const { rows } = await pool.query("SELECT * FROM items WHERE brand_id=($1)", [id])
    return rows;
}

async function getRelatedByCategory(id) {
    const { rows } = await pool.query("SELECT I.*, B.name AS brand FROM items I INNER JOIN brands B ON B.id = I.brand_id WHERE category_id=($1)", [id]);
    return rows;
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
    updateItem,
    updateBrand, 
    updateCategory,
    deleteItem,
    deleteBrand,
    deleteCategory,
    getRelatedByBrand,
    getRelatedByCategory
}