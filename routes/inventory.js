const express = require('express');
const router = express.Router();

// Require controller modules.
const item_controller = require("../controllers/itemController");
const category_controller = require("../controllers/categoryController");
const brand_controller = require("../controllers/brandController");

// Item related routes
router.get("/", item_controller.index);

router.get("/items", item_controller.allItems);

router.get("/item/create", item_controller.item_create_get);

router.post("/item/create", item_controller.item_create_post);

router.get("/item/:id", item_controller.item_detail);

router.get("/item/:id/delete", item_controller.item_delete_get);

router.post("/item/:id/delete", item_controller.item_delete_post);

router.get("/item/:id/update", item_controller.item_update_get);

router.post("/item/:id/update", item_controller.item_update_post);

// Brand Related Routes - Create Routes MUST come before :id etc, or it trys 
// to run the 'detail route'
router.get("/brands", brand_controller.allBrands);

router.get("/brand/create", brand_controller.brand_create_get);

router.post("/brand/create", brand_controller.brand_create_post)

router.get("/brand/:id", brand_controller.brand_detail);

router.get("/brand/:id/delete", brand_controller.brand_delete_get);

router.post("/brand/:id/delete", brand_controller.brand_delete_post);

router.get("/brand/:id/update", brand_controller.brand_update_get),

router.post("/brand/:id/update", brand_controller.brand_update_post);

//Category Related Routes
router.get("/categories", category_controller.allCategories);

router.get("/category/create", category_controller.category_create_get);

router.post("/category/create", category_controller.category_create_post);

router.get("/category/:id", category_controller.category_detail);

router.get("/category/:id/update", category_controller.category_update_get);

router.post("/category/:id/update", category_controller.category_update_post);

router.get('/category/:id/delete', category_controller.category_delete_get);

router.post('/category/:id/delete', category_controller.category_delete_post);


module.exports = router;