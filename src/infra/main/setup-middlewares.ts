import { Express, json } from 'express';

export const setupMiddlewares = (application: Express) => {
  application.use(json());
};
