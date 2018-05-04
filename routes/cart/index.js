const express = require('express');
const router = express.Router();
const knex = require('../../db/knex.js');

router.route('/:user_id/:product_id')
  .post((req, res) => {
    const userId = req.params.user_id;
    const productId = req.params.product_id;
    return knex
      .raw(
        'INSERT INTO cart (user_id, product_id) VALUES (?,?) RETURNING *', [userId, productId]
      )
      .then((data) => {
        const cart = data.rows[0];
        return res.json({
          "success": true
        })
      })
      .catch((err) => {
        console.log(err);
        return res.json({
          'message': 'Invalid user or product'
        });
      })
  })

module.exports = router;