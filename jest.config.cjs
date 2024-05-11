/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    testEnvironment: 'node',
    testMatch: [ "**/__tests__/**/*.spec.ts"],
    collectCoverage: true,
    coverageProvider: 'v8',
    testTimeout: 15000,
    transform: {
        "^.+\\.(t|j)sx?$": "@swc/jest"
    },
};