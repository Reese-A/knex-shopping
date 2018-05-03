const express = require('express');
const articles = require('./articles');
const products = require('./products');

const router = express.Router();

router.use('/users', users);
router.use('/products', products);
router.use('/cart', cart);

module.exports = router;