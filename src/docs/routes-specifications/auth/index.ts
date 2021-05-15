import authenticateReportersSpecification from './authenticate-reporters.post';
import authenticateAdminsSpecification from './authenticate-admins.post';

export const authPaths = {
  '/auth/admins': {
    post: authenticateAdminsSpecification,
  },

  '/auth/reporters': {
    post: authenticateReportersSpecification,
  },
};
