/* eslint-disable no-console */
import { setupMiddlewares } from '@infra/main/setup-middlewares';
import { setupRoutes } from '@infra/main/setup-routes';
import express from 'express';
import { setupDocs } from './docs/setup-docs';

const PORT = process.env.PORT ?? 3000;

(async () => {
  try {
    const application = express();

    setupMiddlewares(application);
    setupRoutes(application);
    setupDocs(application);

    application.listen(PORT, () => {
      console.log(`Server running on port ${PORT}...`);
    });
  } catch (err) {
    console.error('Occurred an error while starting the application.', err);
  }
})();
