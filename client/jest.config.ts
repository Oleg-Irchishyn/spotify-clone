import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['<rootDir>/app/**/__tests__/**/*.spec.[jt]s?(x)'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    '!app/**/__tests__/**',
    '!app/types/**',
    '!app/styles/**',
    '!app/constants/**',
    '!app/**/*.d.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
};

export default createJestConfig(config);
