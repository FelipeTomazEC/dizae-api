import { ItemCategory } from '@entities/item-category/item-category';
import { InMemoryItemCategoryRepository } from '@infra/database/in-memory/in-memory-item-category-repository';

import faker from 'faker';

describe('In memory item category repository tests.', () => {
  const sut = InMemoryItemCategoryRepository.getInstance();
  const itemCategory = ItemCategory.create({
    createdAt: Date.now(),
    creatorId: faker.datatype.uuid(),
    name: faker.commerce.productMaterial(),
  }).value as ItemCategory;

  it('should save an item category.', async () => {
    await expect(sut.save(itemCategory)).resolves.toBeFalsy();
  });

  it('should return true if an item category exists, false otherwise.', async () => {
    await sut.save(itemCategory);
    const exists = await sut.exists(itemCategory.name);

    expect(exists).toBe(true);
  });

  it('should be a singleton.', async () => {
    const instance1 = InMemoryItemCategoryRepository.getInstance();
    const instance2 = InMemoryItemCategoryRepository.getInstance();

    expect(instance1).toBe(instance2);
  });

  it('should return all categories saved.', async () => {
    const createItemCategory = () =>
      ItemCategory.create({
        createdAt: Date.now(),
        creatorId: faker.datatype.uuid(),
        name: faker.commerce.productMaterial(),
      }).value as ItemCategory;

    const categoriesBeforeSaving = await sut.getAll();
    const cat1 = createItemCategory();
    const cat2 = createItemCategory();
    await sut.save(cat1);
    await sut.save(cat2);
    const categoriesAfterSaving = await sut.getAll();

    expect(categoriesAfterSaving).toContain(cat1);
    expect(categoriesAfterSaving).toContain(cat2);
    expect(categoriesAfterSaving.length).toBe(
      categoriesBeforeSaving.length + 2,
    );
  });
});
