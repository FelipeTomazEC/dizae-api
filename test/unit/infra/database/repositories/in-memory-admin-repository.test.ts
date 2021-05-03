import { Admin } from '@entities/admin/admin';
import { Email } from '@entities/shared/email/email';
import { Id } from '@entities/shared/id/id';
import { InMemoryAdminRepository } from '@infra/database/repositories/in-memory-admin-repository';
import faker from 'faker';

describe('In memory admin repository tests.', () => {
  const admin = Admin.create({
    avatar: faker.image.avatar(),
    createdAt: Date.now(),
    email: faker.internet.email(),
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    password: 'Som3-P@s$word',
  }).value as Admin;

  const sut = InMemoryAdminRepository.getInstance();

  it('should store the admin.', async () => {
    await expect(sut.save(admin)).resolves.not.toThrow();
  });

  it('should return true if the e-mail is registered, false otherwise.', async () => {
    const randomEmail = Email.create({ value: faker.internet.email() })
      .value as Email;
    const isRandomRegistered = await sut.emailExists(randomEmail);
    const isAdminRegistered = await sut.emailExists(admin.email);

    expect(isRandomRegistered).toBe(false);
    expect(isAdminRegistered).toBe(true);
  });

  it('should return an admin by its id.', async () => {
    const retrieved = await sut.getById(admin.id);

    expect(retrieved).toStrictEqual(admin);
  });

  it('should return undefined if the given id its not registered.', async () => {
    const notRegisteredId = Id.create({ value: faker.datatype.uuid() })
      .value as Id;
    const retrieved = await sut.getById(notRegisteredId);

    expect(retrieved).toBeFalsy();
  });

  it('should be a singleton.', async () => {
    const instance1 = InMemoryAdminRepository.getInstance();
    const instance2 = InMemoryAdminRepository.getInstance();

    expect(instance1).toBe(instance2);
  });
});
