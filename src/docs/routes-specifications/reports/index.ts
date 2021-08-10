import createReportSpecification from './create-report.post';
import getReportsSpecification from './get-reports.get';
import patchReportSpecification from './update-report.patch';
import getSingleReportSpecification from './get-single-report.get';

export const reportsPaths = {
  '/reports': {
    post: createReportSpecification,
    get: getReportsSpecification,
  },

  '/reports/{report_id}': {
    get: getSingleReportSpecification,
    patch: patchReportSpecification,
  },
};
