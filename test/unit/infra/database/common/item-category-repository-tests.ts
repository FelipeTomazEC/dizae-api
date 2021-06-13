import { Admin } from '@entities/admin/admin';
import { ItemCategory } from '@entities/item-category/item-category';
import { ItemCategoryRepository } from '@use-cases/interfaces/repositories/item-category';
import faker from 'faker';

export const itemCategoryRepositoryTests = (
  sut: ItemCategoryRepository,
  admin: Admin,
) => {
  const itemCategory = ItemCategory.create({
    createdAt: new Date(new Date().setMilliseconds(0)),
    creatorId: admin.id.value,
    name: faker.commerce.productMaterial(),
  }).value as ItemCategory;

  it('should save an item category.', async () => {
    await expect(sut.save(itemCategory)).resolves.toBeFalsy();
  });

  it('should return true if an item category exists, false otherwise.', async () => {
    const exists = await sut.exists(itemCategory.name);

    expect(exists).toBe(true);
  });

  it('should return all categories saved.', async () => {
    const createItemCategory = () =>
      ItemCategory.create({
        createdAt: new Date(new Date().setMilliseconds(0)),
        creatorId: admin.id.value,
        name: faker.commerce
          .productMaterial()
          .concat(faker.random.alphaNumeric()),
      }).value as ItemCategory;

    const categoriesBeforeSaving = await sut.getAll();
    const cat1 = createItemCategory();
    const cat2 = createItemCategory();
    await sut.save(cat1);
    await sut.save(cat2);
    const categoriesAfterSaving = await sut.getAll();

    expect(
      categoriesAfterSaving.find((c) => c.name.isEqual(cat1.name)),
    ).toStrictEqual(cat1);
    expect(
      categoriesAfterSaving.find((c) => c.name.isEqual(cat2.name)),
    ).toStrictEqual(cat2);
    expect(categoriesAfterSaving.length).toBe(
      categoriesBeforeSaving.length + 2,
    );
  });
};
