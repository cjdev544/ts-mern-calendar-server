module.exports = {
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
    '!**/fixtures/*.[jt]s?(x)',
  ],
  testPathIgnorePatterns: ['<rootDir>/mongo/'],
}
