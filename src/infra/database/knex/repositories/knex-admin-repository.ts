/* eslint-disable @typescript-eslint/no-unused-vars */
import { Admin } from "@entities/admin/admin";
import { Email } from "@entities/shared/email/email";
import { Id } from "@entities/shared/id/id";
import { AdminRepository } from "@use-cases/interfaces/repositories/admin";
import { isNullOrUndefined } from "@utils/is-null-or-undefined";
import { Knex } from 'knex'
import { AdminSchema } from "../schemas/admin.schema";

export class KnexAdminRepository implements AdminRepository {
  constructor(private readonly connection: Knex) {}

  async getById(id: Id): Promise<Admin | undefined> {
    const record = await this.connection<AdminSchema>('admin')
      .where({ id: id.value })
      .first();
    
    return !isNullOrUndefined(record)
      ? Admin.create(record!).value as Admin
      : undefined;
  }

  async emailExists(email: Email): Promise<boolean> {
    const record = await this.connection<AdminSchema>('admin')
      .where({email: email.value})
      .first();

    return !isNullOrUndefined(record);
  }

  save(admin: Admin): Promise<void> {
    const schema = KnexAdminRepository.mapEntityToSchema(admin);

    return this.connection<AdminSchema>('admin').insert(schema);
  }

  async getByEmail(email: Email): Promise<Admin | undefined> {
    const schema = await this.connection<AdminSchema>('admin')
      .where({email: email.value})
      .first();
    
    return !isNullOrUndefined(schema)
      ? Admin.create(schema!).value as Admin
      : undefined;
  }

  private static mapEntityToSchema(admin: Admin): AdminSchema {
    return {
      avatar: admin.avatar,
      createdAt: admin.createdAt,
      email: admin.email.value,
      id: admin.id.value,
      name: admin.name.value,
      password: admin.password.value
    }
  }
}