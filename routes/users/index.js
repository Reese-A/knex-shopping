const express = require('express');
const router = express.Router();
const knex = require('../../db/knex.js');

router.route('/')

router.route('/register')
  .post((req, res) => {
    // return new Promise (function(resolve, reject){
    const user = data.rows[0];
    const email = user.email.toLowerCase();
    const password = user.password;
    return knex
      .raw(
        'INSERT INTO users (email, password) VALUES (?,?) RETURNING *', [email, password]
      )
      .then((data) => {
        // if (!user.email || !user.password) {
        //   return res.json({
        //     'message': 'Please fill out all fields before submitting'
        //   })
        // }
        return res.json({
          'id': user.id,
          'email': email,
          'password': password
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