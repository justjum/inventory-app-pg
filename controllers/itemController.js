const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;
const db = require('../db/queries');

exports.index = asyncHandler(async (req, res, next) => {
    // get details of all items, categories, and brands
    try {
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
    } catch {
        res.render('index', {
            title: 'Inventory Application',
            items: {},
            brands: {},
            categories: {}
        })
    }

});

exports.allItems = asyncHandler(async (req, res, next) => {
    const allItems = await db.getAllItems();
    console.log('Got list')
 
// Sort algorithm too slow 
    allItems.sort((a, b) => {
        const brandA = a.brand;
        const brandB = b.brand;
        if (brandA < brandB) {
            return -1;
        }
        if (brandB > brandA) {
            return 1;
        }

        return 0;
    });
    console.log('Sorted')

    res.render("items", {
        title: "All Items",
        items: allItems,
    });
});

exports.item_detail = asyncHandler(async (req, res, next) => {
    const [item_current] = await db.getItem(req.params.id)
    
    if (item_current === null) {
        const err = new Error('Item does not exist');
        err.status = 404;
        return next(err)
    }    

    console.log(item_current)

    res.render('item_detail', {
        title: 'Item Details',
        item: item_current
    });
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
    const [ brands, categories] = await Promise.all([
        db.getAllBrands(),
        db.getAllCategories() 
    ]) 
    console.log(categories)
    res.render('item_form', {
        title: "Create Item",
        categories: categories,
        brands: brands,
    });
})

exports.item_create_post = [
    // Validate and sanitize forms
    body("category", "Category must be specified.").trim().escape(),
    body("brand", "Brand must be specified.").trim().escape(),
    body("model", "Model must be specified.")
        .trim()
        .isLength({ min: 1})
        .escape(),
    body("description", "Description must be specified.")
        .trim()
        .isLength( {min: 1, max:100})
        .escape(),
    body("price", "Price must be between $1 and $20000")
        .trim()
        .isNumeric({min: 1, max: 20000})
        .escape(),
    body("quantity", "Quantity must be between 1 and 100")
        .trim()
        .isNumeric({min: 1, max: 100}),
    body("password", "Incorrect password")
        .trim()
        .isLength({min:1})
        .isIn('!iAnV42ds54'),
    
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        
        const newItem = {
            category: req.body.category,
            brand: req.body.brand,
            model: req.body.model,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            image: req.body.image,
            image_alt: req.body.image_alt   
        };

        if(!errors.isEmpty()) {
            // There are errors, render form with sanitized values and messages.
            const [ brands, categories] = await Promise.all([
                db.getAllBrands(),
                db.getAllCategories() 
            ]) 

            res.render("item_form", {
                title: "Create Item",
                brands: brands,
                categories: categories,
                errors: errors.array(),
                newItem: newItem,
            })
        }

        else {
            // Place holders for image functions
            await db.createItem(req.body.category, req.body.brand, req.body.model, req.body.description, req.body.price, req.body.quantity, req.body.image, req.body.image_alt)
            res.redirect('/inventory/items');
        }  
    })    
]


exports.item_update_get = asyncHandler(async (req, res, next) => {
    const [ allBrands, allCategories, item ] = await Promise.all([
        db.getAllBrands(),
        db.getAllCategories(),
        db.getItem(req.params.id)
    ])
    console.log(item)
    res.render('item_form', {
        title: "Update Item",
        categories: allCategories,
        brands: allBrands,
        newItem: item[0],
        selected_category: item.category,
        selected_brand: item.brand
    });
})

exports.item_update_post = [
    // Validate and sanitize forms
    body("category", "Category must be specified").trim().escape(),
    body("brand", "Brand must be satisfied").trim().escape(),
    body("model", "Model must be specified")
        .trim()
        .isLength({ min: 1})
        .escape(),
    body("description", "Description must be specified")
        .trim()
        .isLength( {min: 1, max:100})
        .escape(),
    body("price", "Price must be between $1 and $20000")
        .trim()
        .isNumeric({min: 1, max: 20000})
        .escape(),
    body("quantity", "Quantity must be between 1 and 100")
        .trim()
        .isNumeric({min: 1, max: 100}),
    body("password", "Incorrect password")
        .trim()
        .isIn('!iAnV42ds54'),
    
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const item = {
            category: req.body.category,
            brand: req.body.brand,
            model: req.body.model,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            image: req.body.image,
            image_alt: req.body.image_alt
        };

        if(!errors.isEmpty()) {
            // There are errors, render form with sanitized values and messages.
            const [ allBrands, allCategories ] = await Promise.all([
                db.getAllBrands(),
                db.getAllCategories()
            ])

            res.render("item_form", {
                title: "Update Item",
                brands: allBrands,
                categories: allCategories,
                errors: errors.array(),
                newItem: item,
                selected_brand: item.brand,
                selected_category: item.category
            })
        } else {
            // Place holders for image functions
            await db.updateItem(req.params.id, req.body.category, req.body.brand, req.body.model, req.body.description, req.body.price, req.body.quantity, req.body.image, req.body.image_alt)
            res.redirect('/inventory/items');
        }  
    })    
]


exports.item_delete_get = asyncHandler(async(req, res, next) => {
    current_item = await db.getItem(req.params.id)
    res.render('item_delete', {
        title: 'Delete Item:',
        item: current_item[0]
    });
}) 

exports.item_delete_post = [
    // Validate password
    body("password", "Incorrect password")
        .trim()
        .isIn('!iAnV42ds54'),


    asyncHandler(async( req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            current_item = {id: req.params.id, name: req.body.name}
            res.render('item_delete', {
                title: 'Delete Item:',
                item: current_item,
                errors: errors.array()
            });
        } else {
            await db.deleteItem(req.params.id)
            res.redirect('/inventory/items')
        }

    })     
    
]


