export interface ErrorLogger {
  log(error: Error): Promise<void>;
}
