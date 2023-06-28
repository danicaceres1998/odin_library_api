'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const debug = require('debug')('app:server');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/db_config.js')[env];
const db = {};

const search_password = function() {
  let password = process.env.DB_PASSWORD;
  if (password !== undefined) return password;

  try {
    password = fs.readFileSync(process.env.DB_PASSWORD_FILE, 'utf8');
  } catch (error) {
    throw error;
  }
  if (password === null || password === undefined || password.length === 0) {
    password = null;
  }

  return password;
}

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    process.env.DB_USER,
    search_password(),
    config
  );
}

fs.readdirSync(__dirname).filter(file => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    file.indexOf('.test.js') === -1
  );
}).forEach(file => {
  const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.connect = async function() {
  try {
    await this.sequelize.authenticate();
    debug('[INFO]: Connection has been established successffully');
  } catch (error) {
    debug(`[ERROR]: Unable to connect to the database: ${error}`);
    throw error;
  }
}
db.disconnect = async function() {
  try {
    await this.sequelize.close();
  } catch (error) {
    debug(`[ERROR]: Unable to disconnect to the database: ${error}`);
    throw error;
  }
}

module.exports = db;
