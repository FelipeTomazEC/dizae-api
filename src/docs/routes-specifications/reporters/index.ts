import registerReporterSpecification from './register-reporter.post';

export const reportersPaths = {
  '/reporters': {
    post: registerReporterSpecification,
  },
};
