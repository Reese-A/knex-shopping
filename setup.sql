\c knex_shopping knex_shopping_user;

DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE users
(
  id serial PRIMARY KEY,
  email varchar(255),
  password varchar(255),
  created_at timestamp,
  updated_at timestamptz
);

CREATE TABLE products
(
  id serial PRIMARY KEY,
  title varchar(255),
  description text,
  inventory integer,
  price decimal(8,2),
  created_at timestamptz,
  updated_at timestamptz
);

CREATE TABLE cart(
  id serial PRIMARY KEY,
  user_id integer REFERENCES users(id),
  product_id integer REFERENCES products(id),
  created_at timestamptz,
  updated_at timestamptz
);