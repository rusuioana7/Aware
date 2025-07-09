// jest.config.ts
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',

    // Look for tests in both your source and a top-level `tests/` folder
    roots: ['<rootDir>/src', '<rootDir>/test'],

    // Or, if you prefer `tests/` only, you can omit `src`:
    // roots: ['<rootDir>/tests'],

    // Files ending in .spec.ts or .test.ts
    testMatch: ['**/?(*.)+(spec|test).ts'],

    // Recognize these extensions
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],

    // Coverage settings
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    coverageThreshold: {
        global: { branches: 80, functions: 80, lines: 80, statements: 80 },
    },

    // If you use path aliases in tsconfig.json, mirror them here:
    // moduleNameMapper: {
    //   '^@app/(.*)$': '<rootDir>/src/$1',
    // },
};

export default config;
