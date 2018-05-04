const express = require('express');
const router = express.Router();
const knex = require('../../db/knex.js');

router.route('/')

router.route('/:user_id')
  .get((req, res) => {
    const user = req.params.user_id;
    console.log(user);
    return knex
      .raw(
        'SELECT * FROM users WHERE id = ?',
        [user]
      )
      .then((data) => {
        if(!data.rows[0]){
          res.status(404);
          throw err;
        }
        return res.json(data.rows[0]);
      })
      .catch((err) => {
        return res.json({
          'message': 'User not found'
        })
      });
  });

router.route('/register')
  .post((req, res) => {
    // return new Promise (function(resolve, reject){
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    return knex
      .raw(
        'INSERT INTO users (email, password) VALUES (?,?) RETURNING *', [email, password]
      )
      .then((data) => {
        const user = data.rows[0];
        // if (!user.email || !user.password) {
        //   return res.json({
        //     'message': 'Please fill out all fields before submitting'
        //   })
        // }
        return res.json({
          'id': user.id,
          'email': user.email,
          'password': user.password
        });
      })
      .catch((err) => {
        console.log(err);
        return res.json({
          "message": "User already exists"
        });
      });
  });

module.exports = router;