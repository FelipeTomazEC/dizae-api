const tsconfig = require('./tsconfig.json');
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);

module.exports = {
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "node",
  testRegex: ["/*.test.ts"],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      diagnostics: true,
    },
    NODE_ENV: 'test',
  },
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  verbose: false,
  moduleNameMapper,
};

