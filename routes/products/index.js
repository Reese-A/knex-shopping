const express = require('express');
const router = express.Router();
const knex = require('../../db/knex.js');

router.route('/')
  .get((req, res) => {
    return knex
      .raw(
        'SELECT * FROM products'
      )
      .then((data) => {
        const products = data.rows;
        if (products.length === 0) {
          return res.json({
            'message': 'No products available'
          })
        }
        return res.json(data.rows)
      })
      .catch((err) => {
        return res.json({
          'message': 'ERROR'
        })
      })
  });


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
        return res.json({
          'message': 'ERROR'
        })
      })
  })

  .put((req, res) => {
    const productId = req.params.product_id;
    let newProduct = req.body
    return knex
      .raw(
        'SELECT title, description, price, inventory FROM products WHERE id = ?', [productId]
      )
      .then((data) => {
        const product = data.rows[0];
        if (!product) {
          return res.json({
            'message': 'Product not found'
          })
        }
        for (key in newProduct) {
          if (newProduct[key] === '') {
            newProduct[key] = product[key];
          }
        }
        return knex
          .raw(
            'UPDATE products SET title = ?, description = ?, price = ?, inventory = ?, updated_at = now() WHERE id = ? RETURNING *', [newProduct.title, newProduct.description, newProduct.price, newProduct.inventory, productId]
          )
          .then((data) => {
            const updatedProd = data.rows[0];
            return res.json({
              "message": `Product: ${productId} has been updated`
            });
          })
          .catch((err) => {
            console.log(err);
            return res.json({
              'message': 'UPDATE ERROR'
            });
          });
      })
      .catch((err) => {
        console.log(err);
        return res.json({
          'message': 'SELECT ERROR'
        });
      })
  })

  .delete((req, res) => {
    const productId = req.params.product_id;
    return knex
      .raw(
        "DELETE FROM products WHERE id = ? RETURNING *", [productId]
      )
      .then((data) => {
        const products = data.rows[0];
        if (products) {
          return res.json({
            "message": `product id: ${productId} successfully deleted`
          })
        }
        return res.status(400).json({
          "message": `Product id: ${product_id} not found`
        })
      })
      .catch((err) => {
        return res.json({
          'message': 'ERROR'
        })
      });
  });


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