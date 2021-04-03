import { AdminData } from '@entities/admin/admin-data';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { Password } from '@entities/shared/password/password';
import { Email } from '@entities/shared/email/email';
import { Either, left, right } from '@shared/either.type';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { Timestamp, URL } from '@entities/shared/renamed-primitive-types';
import { getInvalidValueObject } from '@entities/shared/get-invalid-value-object';
import { isNullOrUndefined } from '@utils/is-null-or-undefined';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';

interface Props {
  avatar: URL;
  id: Id;
  name: Name;
  createdAt: Timestamp;
  password: Password;
  email: Email;
}

export class Admin {
  constructor(private readonly props: Props) {
    Object.freeze(this);
  }

  get avatar(): string {
    return this.props.avatar;
  }

  get id(): Id {
    return this.props.id;
  }

  get name(): Name {
    return this.props.name;
  }

  get createdAt(): Timestamp {
    return this.props.createdAt;
  }

  get password(): Password {
    return this.props.password;
  }

  get email(): Email {
    return this.props.email;
  }

  static create(
    data: AdminData,
  ): Either<MissingParamError | InvalidParamError, Admin> {
    const nameOrError = Name.create({ value: data.name });
    const idOrError = Id.create({ value: data.id });
    const passwordOrError = Password.create({ value: data.password });
    const emailOrError = Email.create({ value: data.email });

    const validation = getInvalidValueObject([
      { name: 'name', valueObject: nameOrError },
      { name: 'id', valueObject: idOrError },
      { name: 'password', valueObject: passwordOrError },
      { name: 'email', valueObject: emailOrError },
    ]);

    if (validation.isLeft()) {
      return left(validation.value);
    }

    if (isNullOrUndefined(data.avatar)) {
      return left(new MissingParamError('avatar'));
    }

    if (isNullOrUndefined(data.createdAt)) {
      return left(new MissingParamError('createdAt'));
    }

    const { avatar, createdAt } = data;
    const name = nameOrError.value as Name;
    const id: Id = idOrError.value as Id;
    const password = passwordOrError.value as Password;
    const email = emailOrError.value as Email;

    return right(new Admin({ email, password, createdAt, name, id, avatar }));
  }
}
