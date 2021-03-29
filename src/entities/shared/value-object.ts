
import { isEqual as _isEqual } from 'lodash';

interface ValueObjectProps {
  readonly [index: string]: any;
}

export abstract class ValueObject<T extends ValueObjectProps> {
  protected readonly props: T;

  protected constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public isEqual(obj: ValueObject<T>): boolean {
    if (obj === null || obj === undefined) {
      return false;
    }

    if (obj.props === undefined) {
      return false;
    }

    return _isEqual(this.props, obj.props);
  }
}