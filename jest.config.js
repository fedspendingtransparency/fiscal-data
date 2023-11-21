module.exports = {
  name: 'tests',
  displayName: 'Standard Tests',
  rootDir: './',
  transform: {
    '^.+\\.(js|ts|jsx|tsx)$': '<rootDir>jest-preprocess.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': `<rootDir>/jest-test-config/identity-obj-proxy-esm.js`,
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `<rootDir>/__mocks__/file-mock.js`,
  },
  testMatch: ['<rootDir>/**/**.spec.{js,jsx,ts,tsx}'],
  testPathIgnorePatterns: [`node_modules`, `.cache`, `public`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)|(@nivo/core))`],
  globals: {
    __PATH_PREFIX__: ``,
    'ts-jest': {
      tsconfig: './tsconfig.spec.json',
    },
  },
  testURL: `http://localhost`,
  testEnvironment: 'jsdom',
  setupFiles: [`<rootDir>/loadershim.js`],
  verbose: true,
  setupFilesAfterEnv: [`<rootDir>/jest.setup.js`],
};
