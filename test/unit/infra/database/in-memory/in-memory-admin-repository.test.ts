import { InMemoryAdminRepository } from '@infra/database/in-memory/in-memory-admin-repository';
import { adminRepositoryTests } from '../common/admin-repository-tests';

describe('In memory admin repository tests.', () => {
  const sut = InMemoryAdminRepository.getInstance();

  adminRepositoryTests(sut);
  
  it('should be a singleton.', async () => {
    const instance1 = InMemoryAdminRepository.getInstance();
    const instance2 = InMemoryAdminRepository.getInstance();

    expect(instance1).toBe(instance2);
  });
});
