import createReportSpecification from './create-report.post';
import getReportsSpecification from './get-reports.get';
import patchReportSpecification from './update-report.patch';

export const reportsPaths = {
  '/reports': {
    post: createReportSpecification,
    get: getReportsSpecification,
  },

  '/reports/{report_id}': {
    patch: patchReportSpecification,
  },
};
