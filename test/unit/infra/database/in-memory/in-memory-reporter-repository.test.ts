import { InMemoryReporterRepository } from '@infra/database/in-memory/in-memory-reporter-repository';
import { reporterRepositoryTests } from '../common/reporter-repository-tests';

describe('In memory reporter repository tests.', () => {
  const sut = InMemoryReporterRepository.getInstance();

  reporterRepositoryTests(sut);

  it('should be a singleton.', async () => {
    const instance1 = InMemoryReporterRepository.getInstance();
    const instance2 = InMemoryReporterRepository.getInstance();

    expect(instance1).toEqual(instance2);
  });
});
