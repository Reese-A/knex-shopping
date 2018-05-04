const express = require('express');
const router = express.Router();
const knex = require('../../db/knex.js');

router.route('/')

router.route('/register')
  .post((req, res) => {
    // return new Promise (function(resolve, reject){
    return knex.raw('INSERT INTO users (email, password) VALUES (?,?) RETURNING *',[req.body.email, req.body.password])
    .then(function(data){
      console.log(data.rows[0]);
      return res.send(data.rows[0]);
      })
    .catch(function(err){
      console.log(err);
      return res.send(err.detail);
    })
  })

module.exports = router;