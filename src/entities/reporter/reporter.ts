import { ReporterData } from '@entities/reporter/reporter-data';
import { Email } from '@entities/shared/email/email';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { Password } from '@entities/shared/password/password';
import { URL } from '@entities/shared/renamed-primitive-types';
import { Either, left, right } from '@shared/either.type';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { getValueObjects } from '@utils/get-value-objects';
import { isNullOrUndefined } from '@utils/is-null-or-undefined';

interface Props {
  id: Id;
  name: Name;
  email: Email;
  password: Password;
  avatar: URL;
  createdAt: Date;
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

  get createdAt(): Date {
    return this.props.createdAt;
  }

  set password(newPassword: Password) {
    this.props.password = newPassword;
  }

  static create(
    data: ReporterData,
  ): Either<InvalidParamError | MissingParamError, Reporter> {
    const idOrError = Id.create({ value: data.id });
    const nameOrError = Name.create({ value: data.name });
    const emailOrError = Email.create({ value: data.email });
    const passwordOrError = Password.create({ value: data.password });
    const { createdAt, avatar } = data;

    const validation = getValueObjects<[Id, Name, Email, Password]>([
      { name: 'id', value: idOrError },
      { name: 'name', value: nameOrError },
      { name: 'email', value: emailOrError },
      { name: 'password', value: passwordOrError },
    ]);

    if (validation.isLeft()) {
      return left(validation.value);
    }

    const [id, name, email, password] = validation.value;

    if (isNullOrUndefined(avatar)) {
      return left(new MissingParamError('avatar'));
    }

    if (isNullOrUndefined(createdAt)) {
      return left(new MissingParamError('createdAt'));
    }

    return right(
      new Reporter({ createdAt, avatar, password, name, id, email }),
    );
  }
}
