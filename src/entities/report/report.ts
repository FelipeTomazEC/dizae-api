import { Id } from '@entities/shared/id/id';
import { Title } from '@entities/report/title/title';
import { Description } from '@entities/report/description/description';
import { Timestamp, URL } from '@entities/shared/renamed-primitive-types';
import { ReportItem } from '@entities/report/report-item/report-item';
import { Status } from '@entities/report/status';
import { ReportData } from '@entities/report/report-data';
import { Either, left, right } from '@shared/either.type';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { getInvalidValueObject } from '@entities/shared/get-invalid-value-object';
import { isNullOrUndefined } from '@utils/is-null-or-undefined';

interface Props {
  id: Id;
  title: Title;
  description: Description;
  createdAt: Timestamp;
  creatorId: Id;
  item: ReportItem;
  image: URL;
  status: Status;
}

export class Report {
  private constructor(private readonly props: Props) {
    Object.freeze(this);
  }

  get id(): Id {
    return this.props.id;
  }

  get title(): Title {
    return this.props.title;
  }

  get description(): Description {
    return this.props.description;
  }

  get createdAt(): Timestamp {
    return this.props.createdAt;
  }

  get creatorId(): Id {
    return this.props.creatorId;
  }

  get item(): ReportItem {
    return this.props.item;
  }

  get image(): URL {
    return this.props.image;
  }

  get status(): Status {
    return this.props.status;
  }

  static create(
    data: ReportData,
  ): Either<MissingParamError | InvalidParamError, Report> {
    const reportItemOrError = ReportItem.create({
      name: data.itemName,
      locationId: data.itemLocationId,
    });
    const creatorIdOrError = Id.create({ value: data.creatorId });
    const titleOrError = Title.create({ value: data.title });
    const descriptionOrError = Description.create({ value: data.description });
    const idOrError = Id.create({ value: data.id });
    const { image, createdAt, status } = data;

    const validation = getInvalidValueObject([
      { name: 'creatorId', valueObject: creatorIdOrError },
      { name: 'title', valueObject: titleOrError },
      { name: 'description', valueObject: descriptionOrError },
      { name: 'id', valueObject: idOrError },
    ]);

    if (validation.isLeft()) {
      return left(validation.value);
    }

    if (reportItemOrError.isLeft()) {
      return left(reportItemOrError.value);
    }

    if (isNullOrUndefined(image)) {
      return left(new MissingParamError('image'));
    }

    if (isNullOrUndefined(createdAt)) {
      return left(new MissingParamError('createdAt'));
    }

    if (isNullOrUndefined(status)) {
      return left(new MissingParamError('status'));
    }

    const item = reportItemOrError.value;
    const title = titleOrError.value as Title;
    const description = descriptionOrError.value as Description;
    const creatorId = creatorIdOrError.value as Id;
    const id = idOrError.value as Id;

    return right(
      new Report({
        status,
        image,
        item,
        createdAt,
        creatorId,
        description,
        id,
        title,
      }),
    );
  }
}
