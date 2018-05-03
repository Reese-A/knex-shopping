const express = require('express');
const bodyParser = require('body-parser');
const knex = require('./db/knex.js');
const routes = require('./routes');

const server = express();
const PORT = process.env.PORT || 3000;

server.use(bodyParser.urlencoded({
  extended: true
}));

server.use('/', routes);

server.listen(PORT, (err) => {
  console.log(`Server running on port: ${PORT}`)
});