const fs = require('fs');

const search_password = function() {
  let password = process.env.DB_PASSWORD;
  if (password !== undefined) return password;

  try {
    password = fs.readFileSync(process.env.DB_PASSWORD_FILE, 'utf8');
  } catch (error) {
    console.log(error);
  }
  if (password === null || password === undefined || password.length === 0) {
    password = null;
  }

  return password;
}

module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": search_password(),
    "host": process.env.DB_HOST,
    "database": "odin_db_development",
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.DB_USER,
    "password": search_password(),
    "host": process.env.DB_HOST,
    "database": "odin_db_test",
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.DB_USER,
    "password": search_password(),
    "host": process.env.DB_HOST,
    "database": "odin_db_production",
    "dialect": "postgres"
  }
};
