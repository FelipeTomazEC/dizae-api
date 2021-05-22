import { ItemCategory } from '@entities/item-category/item-category';
import { generateRandomCollection } from '@test/test-helpers/generate-random-collection';
import { getMock } from '@test/test-helpers/get-mock';
import { GetItemCategoriesUseCase } from '@use-cases/get-item-categories/get-item-categories';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { ItemCategoryRepository } from '@use-cases/interfaces/repositories/item-category';
import faker from 'faker';

describe('Get item categories use case tests.', () => {
  const repository = getMock<ItemCategoryRepository>(['getAll']);
  const presenter = getMock<UseCaseOutputPort<any>>(['success']);
  const sut = new GetItemCategoriesUseCase({ repository, presenter });
  let categories: ItemCategory[];

  beforeAll(() => {
    categories = generateRandomCollection(
      () =>
        ItemCategory.create({
          createdAt: Date.now(),
          creatorId: faker.datatype.uuid(),
          name: faker.commerce.productMaterial(),
        }).value as ItemCategory,
      50,
    );

    jest.spyOn(repository, 'getAll').mockResolvedValue(categories);
  });

  it('should return all item categories registered.', async () => {
    const categoriesCollection = categories.map((cat) => ({
      name: cat.name.value,
      createdAt: cat.createdAt,
    }));

    await sut.execute();

    expect(presenter.success).toBeCalledWith({
      categories: categoriesCollection,
    });
  });
});
