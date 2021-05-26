/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import knex from 'knex';
import path from 'path';

export const setupKnexConnection = (environment = 'development') => {
  const config = require(path.resolve(__dirname, '../../../../knexfile.js'));
  const connection = knex(config[environment]);

  return connection; 
}