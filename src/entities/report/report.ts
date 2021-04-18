import { Description } from '@entities/report/description/description';
import { ReportData } from '@entities/report/report-data';
import { ReportItem } from '@entities/report/report-item/report-item';
import { Status } from '@entities/report/status';
import { Title } from '@entities/report/title/title';
import { InvalidParamError } from '@entities/shared/errors/invalid-param-error';
import { Id } from '@entities/shared/id/id';
import { Timestamp, URL } from '@entities/shared/renamed-primitive-types';
import { Either, left, right } from '@shared/either.type';
import { MissingParamError } from '@shared/errors/missing-param-error';
import { getValueObjects } from '@utils/get-value-objects';
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

    const validation = getValueObjects<[Id, Title, Description, Id]>([
      { name: 'creatorId', value: creatorIdOrError },
      { name: 'title', value: titleOrError },
      { name: 'description', value: descriptionOrError },
      { name: 'id', value: idOrError },
    ]);

    if (validation.isLeft()) {
      return left(validation.value);
    }

    const [creatorId, title, description, id] = validation.value;
    const item = reportItemOrError.value;

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
