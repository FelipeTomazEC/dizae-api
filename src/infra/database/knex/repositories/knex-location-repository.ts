import { Item } from '@entities/location/item/item';
import { Location } from '@entities/location/location';
import { Id } from '@entities/shared/id/id';
import { Name } from '@entities/shared/name/name';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import { isNullOrUndefined } from '@utils/is-null-or-undefined';
import { Knex } from 'knex';
import { ItemSchema } from '../schemas/item.schema';
import { LocationSchema } from '../schemas/location.schema';

export class KnexLocationRepository implements LocationRepository {
  constructor(private readonly connection: Knex) {}

  async getLocationById(id: Id): Promise<Location | undefined> {
    const [locationSchema, itemsSchemas] = await Promise.all([
      this.connection<LocationSchema>('location')
        .where({ id: id.value })
        .first(),
      this.connection<ItemSchema>('item').where({
        location_id: id.value,
        is_deleted: false,
      }),
    ]);

    if (!locationSchema) {
      return undefined;
    }

    const location = KnexLocationRepository.mapLocationSchemaToLocation(
      locationSchema,
    );

    itemsSchemas
      .map(KnexLocationRepository.mapItemSchemaToItem)
      .forEach((item) => location.addItem(item));

    return location;
  }

  async exists(name: Name): Promise<boolean> {
    const record = await this.connection<LocationSchema>('location')
      .where({ name: name.value })
      .first();

    return !isNullOrUndefined(record);
  }

  async save(location: Location): Promise<void> {
    const schema = KnexLocationRepository.mapLocationToSchema(location);
    const exists = await this.getLocationById(location.id);
    if (exists) {
      await this.connection<LocationSchema>('location')
        .where({ id: schema.id })
        .update({
          created_at: schema.created_at,
          creator_id: schema.creator_id,
          name: schema.name,
        });
    } else {
      await this.connection<LocationSchema>('location').insert(schema);
    }

    await this.saveItems(location);
  }

  private async saveItems(location: Location): Promise<void> {
    const items = location.getItems();
    const itemsSchemas = items.map((i) =>
      KnexLocationRepository.mapItemToSchema(i, location),
    );
    const updatePromises = itemsSchemas.map((s) =>
      this.connection<ItemSchema>('item')
        .where({ name: s.name, location_id: s.location_id })
        .update(s),
    );

    const savePromises = itemsSchemas.map(async (item) => {
      const exists = await this.connection<ItemSchema>('item')
        .where({
          name: item.name,
          location_id: item.location_id,
        })
        .first();

      if (!exists) {
        return this.connection<ItemSchema>('item').insert(item);
      }

      return Promise.resolve();
    });

    const deletePromise = this.connection<ItemSchema>('item')
      .update({ is_deleted: true })
      .whereNotIn(
        'name',
        items.map((i) => i.name.value),
      )
      .andWhere({ location_id: location.id.value });

    await Promise.all<any>([...updatePromises, deletePromise, ...savePromises]);
  }

  async getAll(): Promise<Location[]> {
    const ids = await this.connection<LocationSchema>('location').select('id');

    return Promise.all(
      ids.map(({ id: value }) => {
        const id = Id.create({ value }).value as Id;
        return this.getLocationById(id) as Promise<Location>;
      }),
    );
  }

  private static mapLocationToSchema(location: Location): LocationSchema {
    return {
      created_at: location.createdAt,
      creator_id: location.creatorId.value,
      id: location.id.value,
      name: location.name.value,
    };
  }

  private static mapItemToSchema(item: Item, location: Location): ItemSchema {
    return {
      name: item.name.value,
      created_at: item.createdAt,
      creator_id: item.creatorId.value,
      location_id: location.id.value,
      category_name: item.categoryName.value,
      image: item.image,
      is_deleted: false,
    };
  }

  private static mapItemSchemaToItem(schema: ItemSchema): Item {
    return Item.create({
      categoryName: schema.category_name,
      createdAt: schema.created_at,
      creatorId: schema.creator_id,
      image: schema.image,
      name: schema.name,
    }).value as Item;
  }

  private static mapLocationSchemaToLocation(schema: LocationSchema): Location {
    return Location.create({
      createdAt: schema.created_at,
      creatorId: schema.creator_id,
      id: schema.id,
      name: schema.name,
    }).value as Location;
  }
}
