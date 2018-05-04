const express = require('express');
const router = express.Router();
const knex = require('../../db/knex.js');

router.route('/:user_id')
  .get((req, res) => {
    const userId = req.params.user_id;
    return knex
      .raw(
        'SELECT products.* FROM cart INNER JOIN products ON cart.product_id = products.id WHERE cart.user_id = ?', [userId]
      )
      .then((data) => {
        const cart = data.rows;
        if (cart.length == 0) {
          return res.json({
            'message': 'No existing cart found for this user or user does not exist'
          })
        }
        return res.json(cart)
      })
      .catch((err) => {
        return res.json({
          'message': 'ERROR'
        });
      });
  });

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

  .delete((req, res) => {
    const userId = req.params.user_id;
    const productId = req.params.product_id;
    return knex
      .raw(
        'DELETE FROM cart WHERE user_id = ? AND product_id = ? AND (created_at = (SELECT MAX(created_at) FROM cart WHERE cart.user_id = ?)) RETURNING *', [userId, productId, userId]
      )
      .then((data) => {
        console.log(data);
        const cart = data.rows[0];
        console.log('CART', cart);
        if (!cart) {
          return res.json({
            'message': 'cart could not be found'
          })
        }
        console.log('HELLO');
        return res.json({
          "success": true
        })
      })

      .catch((err) => {
        console.log(err);

        return res.json({
          'message': 'ERROR'
        });
      });
  })
// 598459
module.exports = router;