import registerAdminSpecification from './register-admin.post';

export const adminPaths = {
  '/admins': {
    post: registerAdminSpecification,
  },
};
