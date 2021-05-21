import { UseCaseInputPort } from '@use-cases/interfaces/ports/use-case-input-port';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { LocationRepository } from '@use-cases/interfaces/repositories/location';
import { GetAllLocationsInfoResponse } from './dtos/get-all-locations-info-response';

interface Dependencies {
  repository: LocationRepository;
  presenter: UseCaseOutputPort<GetAllLocationsInfoResponse>;
}

export class GetAllLocationsInfoUseCase implements UseCaseInputPort<void> {
  constructor(private readonly dependecies: Dependencies) {}

  async execute(): Promise<void> {
    const { presenter, repository } = this.dependecies;

    const locations = await repository.getAll();

    return presenter.success({
      locations: locations.map((l) => ({
        id: l.id.value,
        name: l.name.value,
        numberOfItems: l.getItems().length,
      })),
    });
  }
}
