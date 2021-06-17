import { Reporter } from '@entities/reporter/reporter';
import { Email } from '@entities/shared/email/email';
import { Id } from '@entities/shared/id/id';
import { ReporterRepository } from '@use-cases/interfaces/repositories/reporter';
import { isNullOrUndefined } from '@utils/is-null-or-undefined';
import { Knex } from 'knex';
import { ReporterSchema } from '../schemas/reporter.schema';

export class KnexReporterRepository implements ReporterRepository {
  constructor(private readonly connection: Knex) {}

  async emailExists(email: Email): Promise<boolean> {
    const exists = await this.connection<ReporterSchema>('reporter')
      .where({
        email: email.value,
      })
      .first();

    return !isNullOrUndefined(exists);
  }

  async save(reporter: Reporter): Promise<void> {
    const schema = KnexReporterRepository.mapReporterToSchema(reporter);
    const exists = !!(await this.getReporterById(reporter.id));

    if (exists) {
      await this.connection<ReporterSchema>('reporter')
        .update(schema)
        .where({ id: reporter.id.value });
    } else {
      await this.connection<ReporterSchema>('reporter').insert(schema);
    }
  }

  async getReporterByEmail(email: Email): Promise<Reporter | undefined> {
    const record = await this.connection<ReporterSchema>('reporter')
      .where({ email: email.value })
      .first();

    return !isNullOrUndefined(record)
      ? KnexReporterRepository.mapSchemaToReporter(record!)
      : undefined;
  }

  async getReporterById(id: Id): Promise<Reporter | undefined> {
    const record = await this.connection<ReporterSchema>('reporter')
      .where({ id: id.value })
      .first();

    return !isNullOrUndefined(record)
      ? KnexReporterRepository.mapSchemaToReporter(record!)
      : undefined;
  }

  private static mapReporterToSchema(reporter: Reporter): ReporterSchema {
    return {
      avatar: reporter.avatar,
      created_at: reporter.createdAt,
      email: reporter.email.value,
      id: reporter.id.value,
      name: reporter.name.value,
      password: reporter.password.value,
    };
  }

  private static mapSchemaToReporter(schema: ReporterSchema): Reporter {
    return Reporter.create({
      avatar: schema.avatar,
      createdAt: new Date(schema.created_at),
      email: schema.email,
      id: schema.id,
      name: schema.name,
      password: schema.password,
    }).value as Reporter;
  }
}
