export const getMock = <T>(functionsToMock: (keyof T)[]): T =>
  (functionsToMock.reduce(
    (mock, func) => ({ ...mock, [func]: jest.fn() }),
    {},
  ) as unknown) as T;
