import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { Email } from '@entities/shared/email/email';
import { Password } from '@entities/shared/password/password';
import { Timestamp, URL } from '@entities/shared/renamed-primitive-types';
import { Either, left, right } from '@shared/either.type';
import { BaseError } from '@shared/errors/base-error';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { ReporterData } from '@entities/reporter/reporter-data';

interface Props {
  id: Id;
  name: Name;
  email: Email;
  password: Password;
  avatar: URL;
  createdAt: Timestamp;
}

export class Reporter {
  private constructor(private readonly props: Props) {
    Object.freeze(this);
  }

  get id(): Id {
    return this.props.id;
  }

  get name(): Name {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get password(): Password {
    return this.props.password;
  }

  get avatar(): URL {
    return this.props.avatar;
  }

  get createdAt(): Timestamp {
    return this.props.createdAt;
  }

  static create(data: ReporterData): Either<BaseError, Reporter> {
    const idOrError = Id.create({ value: data.id });
    const nameOrError = Name.create({ value: data.name });
    const emailOrError = Email.create({ value: data.email });
    const passwordOrError = Password.create({ value: data.password });
    const { createdAt, avatar } = data;

    if (idOrError.isLeft()) {
      return left(idOrError.value);
    }

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    if (avatar === null || avatar === undefined) {
      return left(new MissingParamError('avatar'));
    }

    if (createdAt === null || createdAt === undefined) {
      return left(new MissingParamError('createdAt'));
    }

    const password = passwordOrError.value;
    const name = nameOrError.value;
    const id = idOrError.value;
    const email = emailOrError.value;

    return right(
      new Reporter({ createdAt, avatar, password, name, id, email }),
    );
  }
}
