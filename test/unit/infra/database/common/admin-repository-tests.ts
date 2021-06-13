import { Admin } from '@entities/admin/admin';
import { Email } from '@entities/shared/email/email';
import { Id } from '@entities/shared/id/id';
import { AdminRepository } from '@use-cases/interfaces/repositories/admin';
import faker from 'faker';

export const adminRepositoryTests = (sut: AdminRepository) => {
  const admin = Admin.create({
    avatar: faker.image.avatar(),
    createdAt: new Date(new Date().setMilliseconds(0)),
    email: faker.internet.email(),
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    password: 'Som3-P@s$word',
  }).value as Admin;

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

  it('should return an admin by its e-mail.', async () => {
    const retrieved = await sut.getByEmail(admin.email);

    expect(retrieved).toStrictEqual(admin);
  });
};
