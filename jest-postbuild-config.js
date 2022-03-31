const { defaults } = require('jest-config');

module.exports = {
  preset: 'jest-puppeteer',
  name: 'puppeteer tests',
  displayName: 'Puppeteer Post-build Tests',
  testMatch: [
    "**/__build-tests__/**/*.[jt]s?(x)"
  ],
  transform: {
    "^.+\\.jsx?$": `<rootDir>/jest-preprocess.js`,
  },
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$":
      `identity-obj-proxy`,
    ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      `<rootDir>/__mocks__/file-mock.js`,
  },
  testPathIgnorePatterns: [
    ...defaults.testPathIgnorePatterns,
    `.cache`,
    `public`
  ],
  transformIgnorePatterns: [
    `node_modules/(?!(gatsby)/)`
  ],
  globals: {
    __PATH_PREFIX__: ``
  },
  testURL: `http://localhost`,
  verbose: true,
  setupFilesAfterEnv: [
    `<rootDir>/jest.setup.js`
  ]
};
