import {ValueObject} from "@entities/shared/value-object";
import {Either, left, right} from "@shared/either.type";
import {MissingParamError} from "@shared/errors/missing-param-error";
import {TooFewCharactersError} from "@entities/shared/name/errors/too-few-characters-error";

interface Props {
  value: string;
}

export class Name extends ValueObject<Props> {
  private constructor(props: Props) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create({value}: Props): Either<MissingParamError | TooFewCharactersError, Name> {
    if(value === undefined || value === null) {
      return left(new MissingParamError('name'));
    }

    if(value.length < 2) {
      return left(new TooFewCharactersError());
    }

    const capitalized = Name.capitalize(value);

    return right(new Name({value: capitalized}));
  }

  private static capitalize(value: string): string {
    return value.split(' ')
        .map(word => {
          const head = word.charAt(0).toUpperCase();
          const tail = word.substring(1).toLowerCase();
          return head.concat(tail);
        })
        .join(' ');
  }
}