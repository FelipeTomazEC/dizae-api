import { authPaths } from './auth';
import { reportersPaths } from './reporters';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Dizaê API',
    version: '0.1.0',
    contact: {
      name: 'Felipe Tomaz',
      email: 'felipetomaz@gmail.com',
      url: 'https://github.com/felipetomazec',
    },
    description: `This is the API of the Dizaê APP: an application that connects users to place managers, making easier to report problems.`,
  },
  servers: [{ url: 'http://localhost:3000/' }],
  paths: {
    ...authPaths,
    ...reportersPaths,
  },
};
