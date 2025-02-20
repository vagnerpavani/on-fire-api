module.exports = {
  moduleFileExtensions: ['js', 'ts'],
  rootDir: './',
  modulePaths: ['<rootDir>'],
  testRegex: '.*\\.test\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest'],
  },
  collectCoverageFrom: ['**/*.(t|j)s', '!**/node_modules/**'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  testTimeout: 5 * 60000,
  workerIdleMemoryLimit: 1024,
};
