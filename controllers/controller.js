const db = require('../db/queries');
const asyncHandler = require('express-async-handler');

exports.indexGet = asyncHandler(async (req, res, next) => {
    const [items, brands, categories] = await Promise.all([
        db.getAllItems(),
        db.getAllBrands(),
        db.getAllCategories() 
    ]) 
    console.log(items);

    res.render('index', {
        title: 'Inventory Application',
        items: items,
        brands: brands,
        categories: categories,
    })
})