export type Either<L, R> = Left<L, R> | Right<L, R>;

export class Left<L, R> {
  constructor(readonly value: L) {}

  isLeft(): this is Left<L, R> {
    return true;
  }

  isRight(): this is Right<L, R> {
    return false;
  }
}

export class Right<L, R> {
  constructor(readonly value: R) {}

  isLeft(): this is Left<L, R> {
    return false;
  }

  isRight(): this is Right<L, R> {
    return true;
  }
}

export const left = <L, R>(value: L): Left<L, R> => new Left<L, R>(value);

export const right = <L, R>(value: R): Right<L, R> => new Right<L, R>(value);
