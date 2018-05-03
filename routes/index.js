const express = require('express');
const articles = require('./articles');
const products = require('./products');

const router = express.Router();

router.use('/articles', articles);
router.use('/products', products);

module.exports = router;