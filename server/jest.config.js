module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  moduleFileExtensions: [
    'ts',
    'js',
    'json',
    'node'
  ],
  setupFiles: ['dotenv/config'], // Load .env before tests run
};
