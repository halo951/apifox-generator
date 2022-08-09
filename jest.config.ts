import { Config } from '@jest/types'

const config: Config.InitialOptions = {
    cache: true,
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transformIgnorePatterns: [],
    transform: {
        '^.+\\.jsx?$': 'babel-jest'
    },
    collectCoverage: false,
    coverageDirectory: '.coverage',
    coverageReporters: ['html', 'lcov', 'text'],
    collectCoverageFrom: ['src/**/*.ts'],
    // ignore jest
    coveragePathIgnorePatterns: ['/node_modules/'],
    coverageProvider: 'v8',
    testMatch: ['<rootDir>/__tests__/*.test.ts'],
    rootDir: __dirname
}
export default config
