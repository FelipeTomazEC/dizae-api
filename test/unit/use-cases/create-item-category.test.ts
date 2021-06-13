import { Admin } from '@entities/admin/admin';
import { ItemCategory } from '@entities/item-category/item-category';
import { Name } from '@entities/shared/name/name';
import { getMock } from '@test/test-helpers/get-mock';
import { CreateItemCategoryUseCase } from '@use-cases/create-item-category/create-item-category';
import { CreateItemCategoryRequest } from '@use-cases/create-item-category/dtos/create-item-category-request';
import { ItemCategoryAlreadyExistsError } from '@use-cases/create-item-category/errors/item-category-already-exists-error';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';
import { ItemCategoryRepository } from '@use-cases/interfaces/repositories/item-category';
import { ResourceNotFoundError } from '@use-cases/shared/errors/resource-not-found-error';
import faker from 'faker';

describe('Create item category use case tests.', () => {
  const adminRepo = getMock<AdminRepository>(['getById']);
  const itemCategoryRepo = getMock<ItemCategoryRepository>(['exists', 'save']);
  const presenter = getMock<UseCaseOutputPort<void>>(['failure', 'success']);
  const sut = new CreateItemCategoryUseCase({
    adminRepo,
    itemCategoryRepo,
    presenter,
  });

  let admin: Admin;
  const request: CreateItemCategoryRequest = {
    name: faker.commerce.productMaterial(),
    adminId: faker.datatype.uuid(),
  };

  beforeAll(() => {
    admin = Admin.create({
      avatar: faker.internet.avatar(),
      createdAt: new Date(),
      email: faker.internet.email(),
      id: request.adminId,
      name: faker.name.findName(),
      password: 'som3-pa$sw0rd',
    }).value as Admin;

    jest.spyOn(adminRepo, 'getById').mockResolvedValue(admin);
    jest.spyOn(Date, 'now').mockReturnValue(Date.now());
  });

  it('should verify if the creator exists.', async () => {
    jest.spyOn(adminRepo, 'getById').mockResolvedValueOnce(undefined);

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(
      new ResourceNotFoundError('Admin'),
    );
  });

  it('should not save an existent category.', async () => {
    jest.spyOn(itemCategoryRepo, 'exists').mockResolvedValueOnce(true);
    const name = Name.create({ value: request.name }).value as Name;

    await sut.execute(request);

    expect(presenter.failure).toBeCalledWith(
      new ItemCategoryAlreadyExistsError(name),
    );
  });

  it('should save the category.', async () => {
    const category = ItemCategory.create({
      createdAt: Date.now(),
      creatorId: request.adminId,
      name: request.name,
    }).value as ItemCategory;

    await sut.execute(request);

    expect(itemCategoryRepo.save).toBeCalledWith(category);
  });
});
