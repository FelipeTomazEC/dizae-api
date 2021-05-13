import { AddItemToLocationController } from '@interface-adapters/controllers/add-item-to-location';
import { AuthorizationError } from '@interface-adapters/controllers/errors/authorization-error';
import { InternalServerError } from '@interface-adapters/controllers/errors/internal-server-error';
import { AuthorizationService } from '@interface-adapters/controllers/interfaces/authorization-service';
import { ErrorLogger } from '@interface-adapters/controllers/interfaces/error-logger';
import { HttpRequest } from '@interface-adapters/http/http-request';
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
  const request = new HttpRequest({
    method: 'POST',
    headers: [{ name: 'authorization', value: 'Bearer some-token-here' }],
    params: [{ name: 'locationId', value: locationId }],
    body: {
      categoryName: faker.commerce.productMaterial(),
      name: faker.commerce.product(),
      adminId: faker.datatype.uuid(),
      image: faker.image.image(),
    },
  });

  beforeAll(() => {
    jest.spyOn(authorizer, 'validate').mockResolvedValue(true);
  });

  it('should block unauthenticated access.', async () => {
    jest.spyOn(authorizer, 'validate').mockResolvedValueOnce(false);
    await sut.handle(request);

    expect(presenter.failure).toBeCalledWith(new AuthorizationError());
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
      adminId: request.body.adminId,
      categoryName: request.body.categoryName,
      locationId,
      image: request.body.image,
      name: request.body.name,
    });
  });
});
