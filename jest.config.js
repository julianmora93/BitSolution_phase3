export const preset = 'ts-jest'
export const testEnvironment = 'node'
export const collectCoverage = true
export const coverageDirectory = 'coverage'
export const collectCoverageFrom = ['src/routes/*.ts', '!**/node_modules/**']
export const coverageThreshold = {
  global: {
    branches: 0,
    functions: 85,
    lines: 85,
    statements: 85,
  },
}
