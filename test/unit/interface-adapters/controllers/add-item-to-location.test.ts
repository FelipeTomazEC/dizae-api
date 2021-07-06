import { Id } from '@entities/shared/id/id';
import { AddItemToLocationController } from '@interface-adapters/controllers/add-item-to-location';
import { AuthorizationError } from '@interface-adapters/controllers/errors/authorization-error';
import { InternalServerError } from '@interface-adapters/controllers/errors/internal-server-error';
import { AuthorizationService } from '@interface-adapters/controllers/interfaces/authorization-service';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { HttpRequest } from '@interface-adapters/http/http-request';
import { left, right } from '@shared/either.type';
import { getMock } from '@test/test-helpers/get-mock';
import { AddItemToLocationUseCase } from '@use-cases/add-item-to-location/add-item-to-location';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import faker from 'faker';

describe('Add item to location controller tests.', () => {
  const useCase = getMock<AddItemToLocationUseCase>(['execute']);
  const presenter = getMock<UseCaseOutputPort<any>>(['failure']);
  const authorizer = getMock<AuthorizationService>(['validate']);
  const logger = getMock<ErrorLogger>(['log']);
  const sut = new AddItemToLocationController(
    authorizer,
    logger,
    useCase,
    presenter,
  );

  const locationId = faker.datatype.uuid();
  const adminId = Id.create({ value: faker.datatype.uuid() }).value as Id;
  const request = new HttpRequest({
    method: 'POST',
    headers: [{ name: 'authorization', value: 'Bearer some-token-here' }],
    params: [{ name: 'location_id', value: locationId }],
    body: {
      categoryName: faker.commerce.productMaterial(),
      name: faker.commerce.product(),
      image: faker.image.image(),
    },
  });

  beforeAll(() => {
    jest.spyOn(authorizer, 'validate').mockResolvedValue(right(adminId));
  });

  it('should block unauthenticated access.', async () => {
    const error = new AuthorizationError();
    jest.spyOn(authorizer, 'validate').mockResolvedValueOnce(left(error));
    await sut.handle(request);

    expect(presenter.failure).toBeCalledWith(error);
  });

  it('should log and send to the presenter internal errors.', async () => {
    const error = new Error('Ooops. Internal error here.');
    jest.spyOn(useCase, 'execute').mockRejectedValueOnce(error);
    await sut.handle(request);

    expect(presenter.failure).toBeCalledWith(new InternalServerError());
    expect(logger.log).toBeCalledWith(error);
  });

  it('should should call the use case with the params from the request.', async () => {
    await sut.handle(request);

    expect(useCase.execute).toBeCalledWith({
      adminId: adminId.value,
      categoryName: request.body.categoryName,
      locationId,
      image: request.body.image,
      name: request.body.name,
    });
  });
});
