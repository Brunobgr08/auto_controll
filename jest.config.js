module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/tests/**/*.js',
  ],
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/unit/**/*.test.js',
    '**/tests/integration/**/*.test.js',
  ],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverage: true,
};
