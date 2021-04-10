export interface UseCaseInputPort<T> {
  execute(request: T): Promise<void>;
}
