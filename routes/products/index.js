const express = require('express');
const router = express.Router();
const knex = require('../../db/knex.js');

router.route('/');

// router.route('/:product_id')
//   .get((req,res) => {
//     const productId = req.
//   })

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
          'message':'Must POST all product fields'
        })
      })
  });



module.exports = router;