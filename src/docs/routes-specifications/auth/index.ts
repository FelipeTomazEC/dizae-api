import authenticateReportersSpecification from './authenticate-reporters.post';
import authenticateAdminsSpecification from './authenticate-admins.post';

export const authPaths = {
  '/auth/admins': authenticateAdminsSpecification,
  '/auth/reporters': authenticateReportersSpecification,
};
