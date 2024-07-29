const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const db = require('../db/queries');

exports.allBrands = asyncHandler(async (req, res, next) => {
    const allBrands = await db.getAllBrands();
    res.render('brands', {
        title: 'All Brands',
        brands: allBrands
    });
});

exports.brand_detail = asyncHandler(async (req, res, next) => {
    const brand = await db.getBrand(req.params.id)

    if (brand === null) {
        const err = new Error('Brand does not exist');
        err.status = 404;
        return next(err)
    }

    res.render('brand_detail', {
        title: 'Brand Detail:',
        brand: brand
    });
});

exports.brand_create_get = asyncHandler(async (req, res, next) => {
    res.render('brand_form', {
        title: "Create Brand",
    })
});

exports.brand_create_post = [
    
    body("name", "Must have brand name.").isLength(min=1).escape(),
    body('website', "Must be a URL.").isURL(),
    body("password", "Incorrect password")
        .trim()
        .isLength({min:1})
        .isIn('!iAnV42ds54'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        console.log('create post');
        const brand = await db.getBrandByName(req.body.name);
        
        if (brand.length > 0) {
            console.log('redirect')
            res.redirect('/inventory/brands')
            return;
        }

        const newBrand = {
            name: req.body.name,
            website: req.body.website
        }

        if (!errors.isEmpty()) {
            res.render('brand_form', {
                title: 'Create Brand',
                newBrand: newBrand,
                errors: errors.array()
            })

        }

        else {
            await db.createBrand(req.body.name, req.body.website)
            res.redirect("/inventory/brands")
        }
    })
]

exports.brand_delete_get = asyncHandler(async (req, res, next) => {
    const [currentBrand, relatedItems] = await Promise.all([
        db.getBrand(req.params.id),
        db.getRelatedByBrand(req.params.id)
    ])
    console.log(relatedItems)
    res.render('brand_delete', {
        title: 'Delete Brand',
        brand: currentBrand[0],
        items: relatedItems
    })
})

exports.brand_delete_post = [
    body("password", "Incorrect password")
        .trim()
        .isIn('!iAnV42ds54'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const currentBrand = await db.getBrand(req.params.id)

            res.render('brand_delete', {
                title: 'Delete Brand',
                brand: currentBrand[0],
                items: [],
                errors: errors.array()
            })
            return;
        }

        await db.deleteBrand(req.body.id)
        res.redirect('/inventory/brands');
    })
]


exports.brand_update_get = asyncHandler(async (req, res, next) => {
    console.log('update get')
    const brand = await db.getBrand(req.params.id)
    res.render('brand_form', {
        title: "Update Brand",
        newBrand: brand[0]
    })
});

exports.brand_update_post = [
    body("name", "Must have brand name.").isLength(min=1).escape(),
    body("password", "Incorrect password")
        .trim()
        .isIn('!iAnV42ds54'),

    asyncHandler(async (req, res, next) => {
        console.log('update post')
        const errors = validationResult(req);

        const brand = {
            name: req.body.name,
            website: req.body.website
        }

        if (!errors.isEmpty()) {
            res.render('brand_form', {
                title: 'Update Brand',
                newBrand: brand,
                errors: errors.array()
            })
            return;
        }

        else {
            const updatedBrand = await db.updateBrand(req.params.id, req.body.name, req.body.website);
            res.redirect('/inventory/brands');
        }
    })
]

