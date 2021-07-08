import { Express, json } from 'express';
import cors from 'cors';

export const setupMiddlewares = (application: Express) => {
  application.use(cors());
  application.use(json({ limit: '10mb' }));
};
