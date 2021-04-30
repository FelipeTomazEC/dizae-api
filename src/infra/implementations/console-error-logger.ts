import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';

export class ConsoleErrorLogger implements ErrorLogger {
  log(error: Error): Promise<void> {
    // eslint-disable-next-line no-console
    console.error(error);
    return Promise.resolve();
  }
}
