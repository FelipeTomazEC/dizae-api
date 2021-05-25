import createReportSpecification from './create-report.post';
import getReportsSpecification from './get-reports.get';

export const reportsPaths = {
  '/reports': {
    post: createReportSpecification,
    get: getReportsSpecification,
  },
};
