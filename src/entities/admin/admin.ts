import { AdminData, Timestamp, URL } from '@entities/admin/admin-data';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { Password } from '@entities/shared/password/password';
import { Email } from '@entities/shared/email/email';
import { Either, left, right } from '@shared/either.type';
import { BaseError } from '@shared/errors/base-error';
import { MissingParamError } from '@shared/errors/missing-param-error';

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

  static create(data: AdminData): Either<BaseError, Admin> {
    const nameOrError = Name.create({ value: data.name });
    const idOrError = Id.create({ value: data.id });
    const passwordOrError = Password.create({ value: data.password });
    const emailOrError = Email.create({ value: data.email });

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    if (idOrError.isLeft()) {
      return left(idOrError.value);
    }

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    if (data.avatar === undefined || data.avatar === null) {
      return left(new MissingParamError('avatar'));
    }

    if (data.createdAt === undefined || data.createdAt === null) {
      return left(new MissingParamError('createdAt'));
    }

    const { avatar, createdAt } = data;
    const name: Name = nameOrError.value;
    const id: Id = idOrError.value;
    const password: Password = passwordOrError.value;
    const email: Email = emailOrError.value;

    return right(new Admin({ email, password, createdAt, name, id, avatar }));
  }
}
