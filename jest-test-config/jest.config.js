module.exports = {
  name: 'tests',
  displayName: 'Standard Tests',
  rootDir: '../',
  transform: {
    '^.+\\.jsx?$': `<rootDir>/jest-preprocess.js`,
  },
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': `<rootDir>/jest-test-config/identity-obj-proxy-esm.js`,
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `<rootDir>/__mocks__/file-mock.js`,
  },
  testMatch: ['<rootDir>/**/__tests__/*.{js,jsx}', '<rootDir>/**/**.spec.{js,jsx}'],
  testPathIgnorePatterns: [`node_modules`, `.cache`, `public`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
  globals: {
    __PATH_PREFIX__: ``,
  },
  testURL: `http://localhost`,
  setupFiles: [`<rootDir>/loadershim.js`],
  verbose: true,
  setupFilesAfterEnv: [`<rootDir>/jest.setup.js`],
};
