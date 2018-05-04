const express = require('express');
const router = express.Router();
const knex = require('../../db/knex.js');

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
        res.send('something fucked up')
      });
  });


router.route('/register')
  .post((req, res) => {
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
        return res.json(user);
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
          return res.status(404).json({
            "message": "User ID not found"
          })
        }
        return res.json({
          "message": "New password created!"
        })
      })
      .catch((err) => {
        return res.send('terrible things have happened')
      });
  });

router.route('/:user_id/delete')
  .delete((req, res) => {
    const userId = req.params.user_id;
    return knex
      .raw(
        "DELETE FROM users WHERE id = ? RETURNING *", [userId]
      )
      .then((data) => {
        console.log(data);
        const user = data.rows[0];
        if (user) {
          return res.json({
            "message": `User id: ${userId} successfully deleted`
          })
        }
          return res.status(400).json({
            "message": "User ID not found"
          })
      })
      .catch((err) => {
        return res.send('ERROR')
      });
  });

module.exports = router;