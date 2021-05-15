import createReportSpecification from './create-report.post';

export const reportsPaths = {
  '/reports': {
    post: createReportSpecification,
  },
};
