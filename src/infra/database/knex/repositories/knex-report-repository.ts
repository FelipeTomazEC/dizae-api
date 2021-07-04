/* eslint-disable func-names */
import { Report } from '@entities/report/report';
import { Id } from '@entities/shared/id/id';
import { GetByIdRepository } from '@use-cases/interfaces/repositories/common/get-by-id-repository';
import { UpdateRepository } from '@use-cases/interfaces/repositories/common/update-repository';
import {
  GetReportsFilters,
  ReportRepository,
} from '@use-cases/interfaces/repositories/report';
import { Pagination } from '@use-cases/shared/pagination-settings';
import { isNullOrUndefined } from '@utils/is-null-or-undefined';
import { Knex } from 'knex';
import { ReportSchema } from '../schemas/report.schema';

export class KnexReportRepository
  implements
    ReportRepository,
    UpdateRepository<Report>,
    GetByIdRepository<Report> {
  constructor(private readonly connection: Knex) {}

  async save(report: Report): Promise<void> {
    const exists = await this.connection<ReportSchema>('report')
      .where({ id: report.id.value })
      .first();

    const schema = KnexReportRepository.mapReportToReportSchema(report);
    if (isNullOrUndefined(exists)) {
      await this.connection<ReportSchema>('report').insert(schema);
    } else {
      await this.update(report);
    }
  }

  async getAll(
    filters: GetReportsFilters,
    pagination: Pagination,
  ): Promise<Report[]> {
    let builder = this.connection<ReportSchema>('report')
      .select(
        'report.created_at',
        'description',
        'report.id',
        'report.image',
        'item_name',
        'item.location_id',
        'report.reporter_id',
        'status',
        'title',
      )
      .join('item', function () {
        this.on('report.item_name', '=', 'item.name');
        this.on('report.location_id', '=', 'item.location_id');
      })
      .join('item_category', 'item.category_name', '=', 'item_category.name')
      .orderBy('report.created_at')
      .limit(pagination.offset)
      .offset(pagination.start);

    if (filters.itemCategories) {
      builder = builder.whereIn('item_category.name', filters.itemCategories);
    }

    if (filters.locationsIds) {
      builder = builder.whereIn('item.location_id', filters.locationsIds);
    }

    if (filters.since) {
      builder = builder.andWhere('report.created_at', '>=', filters.since);
    }

    if (filters.status) {
      builder = builder.whereIn('status', filters.status);
    }

    const records = await builder.then<ReportSchema[]>();

    return records.map(KnexReportRepository.mapSchemaToReport);
  }

  async update(report: Report): Promise<void> {
    const schema = KnexReportRepository.mapReportToReportSchema(report);
    await this.connection<ReportSchema>('report').update({
      description: schema.description,
      image: schema.image,
      status: schema.status,
      title: schema.title,
    });
  }

  async getById(id: Id): Promise<Report | null> {
    const record = await this.connection<ReportSchema>('report')
      .where({ id: id.value })
      .first();

    return !isNullOrUndefined(record)
      ? KnexReportRepository.mapSchemaToReport(record!)
      : null;
  }

  private static mapSchemaToReport(schema: ReportSchema): Report {
    return Report.create({
      createdAt: new Date(schema.created_at),
      creatorId: schema.reporter_id,
      description: schema.description,
      id: schema.id,
      image: schema.image,
      itemLocationId: schema.location_id,
      itemName: schema.item_name,
      status: schema.status,
      title: schema.title,
    }).value as Report;
  }

  private static mapReportToReportSchema(report: Report): ReportSchema {
    return {
      created_at: report.createdAt,
      description: report.description.value,
      id: report.id.value,
      image: report.image,
      item_name: report.item.name.value,
      location_id: report.item.locationId.value,
      reporter_id: report.creatorId.value,
      status: report.status,
      title: report.title.value,
    };
  }
}
