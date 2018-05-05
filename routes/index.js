const express = require('express');
const users = require('./users');
const products = require('./products');
const cart = require('./cart');
const knex = require('../db/knex.js');

const router = express.Router();

router.use('/users', users);
router.use('/products', products);
router.use('/cart', cart);

module.exports = router;