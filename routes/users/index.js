const express = require('express');
const router = express.Router();
const knex = require('../../db/knex.js');

router.route('/')

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