\c knex_shopping knex_shopping_user;

DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE users
(
  id serial PRIMARY KEY,
  email varchar(255) UNIQUE CHECK (email != ''),
  password varchar(255) CHECK (password != ''),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT NULL
);

CREATE TABLE products
(
  id serial PRIMARY KEY,
  title varchar(255) CHECK (title != ''),
  description text CHECK (description != ''),
  inventory integer CHECK (inventory > 0),
  price money,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT NULL
  );

CREATE TABLE cart(
  id serial PRIMARY KEY,
  user_id integer REFERENCES users(id),
  product_id integer REFERENCES products(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT NULL
);

CREATE TABLE purchases(
  id serial PRIMARY KEY,
  user_id integer REFERENCES users(id),
  product_id integer REFERENCES products(id),
  created_at timestamptz DEFAULT now(),
)