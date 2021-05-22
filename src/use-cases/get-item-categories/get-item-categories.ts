import { UseCaseInputPort } from '@use-cases/interfaces/ports/use-case-input-port';
import { UseCaseOutputPort } from '@use-cases/interfaces/ports/use-case-output-port';
import { ItemCategoryRepository } from '@use-cases/interfaces/repositories/item-category';
import { GetItemCategoriesResponse } from './dtos/get-item-categories-response';

interface Dependencies {
  repository: ItemCategoryRepository;
  presenter: UseCaseOutputPort<GetItemCategoriesResponse>;
}

export class GetItemCategoriesUseCase implements UseCaseInputPort<void> {
  constructor(private readonly dependencies: Dependencies) {}

  async execute(): Promise<void> {
    const { presenter, repository } = this.dependencies;

    const categories = await repository.getAll();

    return presenter.success({
      categories: categories.map((cat) => ({
        createdAt: cat.createdAt,
        name: cat.name.value,
      })),
    });
  }
}
