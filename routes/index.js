var express = require('express');
var router = express.Router();
const controller = require('../controllers/controller')

/* GET home page. */
router.get('/', controller.indexGet);

module.exports = router;
