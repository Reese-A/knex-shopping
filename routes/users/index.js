const express = require('express');
const router = express.Router();
const knex = require('../../db/knex.js');

router.route('/')

router.route('/:user_id')
  .get((req, res) => {
    const user = req.params.user_id;
    return knex
      .raw(
        'SELECT * FROM users WHERE id = ?', [user]
      )
      .then((data) => {
        if (!data.rows[0]) {
          return res.status(404).json({
            'message': 'User not found'
          })
        }
        return res.json(data.rows[0]);
      })
      .catch((err) => {
        res.send('oh no');
      });
  });


router.route('/login')
  .post((req, res) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    return knex
      .raw(
        'SELECT * FROM users WHERE email = ?', [email]
      )
      .then((data) => {
        const user = data.rows[0];
        if (!user) {
          return res.status(404).json({
            'message': 'user does not exist'
          })
        }
        if (password !== user.password) {
          return res.json({
            'message': 'incorrect password'
          })
        }
        return res.json(user);
      })
      .catch((err) => {
        res.send('you fucked up')
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


router.route('/:user_id/forgot-password')
  .put((req, res) => {
    const userId = req.params.user_id;
    const password = req.body.password;
    return knex
      .raw(
        'UPDATE users SET password = ? WHERE id = ? RETURNING *', [password, userId]
      )
      .then((data) => {
        const user = data.rows[0];
        if (!user) {
          return res.json({
            "message": "New password created!"
          })
        }
        return res.status(404).json({
          "message": "User ID not found"
        })
      })
      .catch((err)=>{
        return res.send('terrible things have happened')
      });
  });

module.exports = router;