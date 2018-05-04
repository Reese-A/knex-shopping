const express = require('express');
const router = express.Router();
const knex = require('../../db/knex.js');

router.route('/')

router.route('/register')
  .post((req, res) => {
    // return new Promise (function(resolve, reject){
    return knex
      .raw(
        'INSERT INTO users (email, password) VALUES (?,?) RETURNING *', [req.body.email, req.body.password]
      )
      .then((data) => {
        const user = data.rows[0];
        console.log(user);
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