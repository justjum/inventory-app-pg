const asyncHandler = require('express-async-handler');
const db = require('../db/queries');

const { body, validationResult } = require('express-validator');
const { allItems } = require('./itemController');

exports.allCategories = asyncHandler(async (req, res, next) => {
    const allCategories = await db.getAllCategories();

    res.render('categories', {
        title: 'All Categories',
        categories: allCategories
    });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
    const category = await db.getCategory(req.params.id)

    if (category === null) {
        const err = new Error('Category does not exist');
        err.status = 404;
        return next(err);
    }

    res.render('category_detail', {
        title: "Category Detail:",
        category: category,
    });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.render('category_form', {
        title: 'Create Category',
    });
});

exports.category_create_post = [
    body("name", "Category must have a name")
        .isLength({min:1})
        .escape(),
    body("password", "Incorrect password")
        .trim()
        .isIn('!iAnV42ds54'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const category = await Category.findOne({name: req.body.name}).exec();

        if (category !== null) {
            res.redirect(category.url)
            return;
        }

        const newCategory = new Category({name:req.body.name});

        if (!errors.isEmpty()) {
            res.render('category_form', {
                title: 'Create Category',
                errors: errors.array(),
                newCategory: newCategory
            });
        }

        else {
            await newCategory.save();
            res.redirect(newCategory.url)
        }
    })
]

exports.category_delete_get = asyncHandler(async (req, res, next) => {
    const [currentCategory, allItems] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id })
            .populate('brand')
            .exec()
    ])

    res.render('category_delete', {
        title: 'Category Delete',
        category: currentCategory,
        items: allItems
    })
})

exports.category_delete_post = [
    body("password", "Incorrect password")
        .trim()
        .isIn('!iAnV42ds54'),

    asyncHandler(async (req, res, next)=> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const currentCategory = await Category.findById(req.params.id).exec();

            res.render('category_delete', {
                title: 'Delete Category',
                category: currentCategory,
                items: [],
                errors: errors.array()
            })
            return
        }

        await Category.findByIdAndDelete(req.body.categoryid);
        res.redirect('/inventory/categories')
    })
]


exports.category_update_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id)
    res.render('category_form', {
        title: "Update Category",
        newCategory: category
    })
});

exports.category_update_post = [
    body("name", "Must have category name.").isLength(min=1).escape(),
    body("password", "Incorrect password")
        .trim()
        .isIn('!iAnV42ds54'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({
            _id: req.params.id,
            name: req.body.name
        })

        if (!errors.isEmpty()) {
            res.render('category_form', {
                title: 'Update Category',
                newCategory: category,
                errors: errors.array()
            })
            return
        }

        else {
            await Category.findByIdAndUpdate(req.params.id, category, {});
            res.redirect('/inventory/categories')
        }
    })
]