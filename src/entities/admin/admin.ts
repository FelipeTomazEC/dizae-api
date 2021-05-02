import { AdminData } from '@entities/admin/admin-data';
import { Email } from '@entities/shared/email/email';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { Password } from '@entities/shared/password/password';
import { Timestamp, URL } from '@entities/shared/renamed-primitive-types';
import { Either, left, right } from '@shared/either.type';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { getValueObjects } from '@utils/get-value-objects';
import { isNullOrUndefined } from '@utils/is-null-or-undefined';

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

  set password(value: Password) {
    this.props.password = value;
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

    if (isNullOrUndefined(data.avatar)) {
      return left(new MissingParamError('avatar'));
    }

    if (isNullOrUndefined(data.createdAt)) {
      return left(new MissingParamError('createdAt'));
    }

    const validation = getValueObjects<[Name, Id, Password, Email]>([
      { name: 'name', value: nameOrError },
      { name: 'id', value: idOrError },
      { name: 'password', value: passwordOrError },
      { name: 'email', value: emailOrError },
    ]);

    if (validation.isLeft()) {
      return left(validation.value);
    }

    const [name, id, password, email] = validation.value;

    const { avatar, createdAt } = data;

    return right(new Admin({ email, password, createdAt, name, id, avatar }));
  }
}
