const express = require('express');
const router = express.Router();
const knex = require('../../db/knex.js');

router.route('/');

router.route('/:product_id')
  .get((req, res) => {
    const productId = req.params.product_id;
    return knex
      .raw(
        'SELECT * FROM products WHERE id = ?', [productId]
      )
      .then((data) => {
        if (!data.rows[0]) {
          return res.status(404).json({
            "message": "Product not found"
          });
        }
        return res.json(data.rows[0]);
      })
      .catch((err) => {
        res.send('everything is on fire');
      })
  })

router.route('/new')
  .post((req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const inventory = Number(req.body.inventory);
    const price = Number(req.body.price);
    return knex
      .raw(
        'INSERT INTO products (title, description, inventory, price) VALUES (?,?,?,?) RETURNING *', [title, description, inventory, price]
      )
      .then((data) => {
        const product = data.rows[0];
        return res.json(product);
      })
      .catch((err) => {
        return res.json({
          'message': 'Must POST all product fields'
        })
      })
  });



module.exports = router;