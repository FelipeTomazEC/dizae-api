export abstract class ValueObjectError extends Error {
  protected constructor(message: string) {
    super(message);
  }
}
