import { Reporter } from '@entities/reporter/reporter';
import { Email } from '@entities/shared/email/email';
import { ReporterRepository } from '@use-cases/interfaces/repositories/reporter';
import faker from 'faker';

export const reporterRepositoryTests = (sut: ReporterRepository): void => {
  const testReporter = Reporter.create({
    avatar: faker.internet.avatar(),
    createdAt: Date.now(),
    email: faker.internet.email(),
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    password: 's0m3pa$$word',
  }).value as Reporter;

  it('should store a reporter.', async () => {
    await expect(sut.save(testReporter)).resolves.not.toThrow();
  });

  it('should return a reporter by the e-mail.', async () => {
    await sut.save(testReporter);
    const reporter = await sut.getReporterByEmail(testReporter.email);

    expect(reporter).toStrictEqual(testReporter);
  });

  it('should return a reporter by the id.', async () => {
    await sut.save(testReporter);
    const reporter = await sut.getReporterById(testReporter.id);

    expect(reporter).toStrictEqual(testReporter);
  });

  it('should return true if an email is registered, false otherwise.', async () => {
    await sut.save(testReporter);
    const email = Email.create({ value: 'email@notregistered.com' })
      .value as Email;
    const isTestReporterRegistered = await sut.emailExists(testReporter.email);
    const isEmailRegistered = await sut.emailExists(email);

    expect(isTestReporterRegistered).toBeTruthy();
    expect(isEmailRegistered).toBeFalsy();
  });
};
