import { Id } from '@entities/shared/id/id';
import { CreateItemCategoryController } from '@interface-adapters/controllers/create-item-category';
import { AuthorizationError } from '@interface-adapters/controllers/errors/authorization-error';
import { InternalServerError } from '@interface-adapters/controllers/errors/internal-server-error';
import { AuthorizationService } from '@interface-adapters/controllers/interfaces/authorization-service';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { left, right } from '@shared/either.type';
import { getMock } from '@test/test-helpers/get-mock';
import { CreateItemCategoryUseCase } from '@use-cases/create-item-category/create-item-category';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import faker from 'faker';

describe('Create item category controller tests.', () => {
  const authorizer = getMock<AuthorizationService>(['validate']);
  const logger = getMock<ErrorLogger>(['log']);
  const useCase = getMock<CreateItemCategoryUseCase>(['execute']);
  const presenter = getMock<UseCaseOutputPort<any>>(['failure']);
  const sut = new CreateItemCategoryController(
    authorizer,
    logger,
    useCase,
    presenter,
  );

  const request = new HttpRequest({
    method: 'POST',
    body: {
      name: faker.commerce.productMaterial(),
    },
    headers: [{ name: 'authorization', value: 'Bearer some-token' }],
  });

  const adminId = Id.create({ value: faker.datatype.uuid() }).value as Id;

  beforeAll(() => {
    jest.spyOn(authorizer, 'validate').mockResolvedValue(right(adminId));
  });

  it('should get the params from the request and pass to the use case.', async () => {
    await sut.handle(request);

    expect(useCase.execute).toBeCalledWith({
      name: request.body.name,
      adminId: adminId.value,
    });
  });

  it('should not allow unauthenticated admins access the use case.', async () => {
    const error = new AuthorizationError();
    jest.spyOn(authorizer, 'validate').mockResolvedValueOnce(left(error));

    await sut.handle(request);

    expect(presenter.failure).toBeCalledWith(error);
  });

  it('should log internal errors and send it to the presenter.', async () => {
    const error = new Error('Oops. Error here.');
    jest.spyOn(useCase, 'execute').mockRejectedValueOnce(error);

    await sut.handle(request);

    expect(presenter.failure).toBeCalledWith(new InternalServerError());
    expect(logger.log).toBeCalledWith(error);
  });

  it('should pass the credentials to the authorizer.', async () => {
    await sut.handle(request);

    expect(authorizer.validate).toBeCalledWith('some-token');
  });
});
