module.exports = {
  displayName: 'Standard Tests',
  rootDir: './',
  transform: {
    '^.+\\.(js|ts|jsx|tsx)$': '<rootDir>jest-preprocess.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': `<rootDir>/jest-test-config/identity-obj-proxy-esm.js`,
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `<rootDir>/__mocks__/file-mock.js`,
    '^gatsby-core-utils/(.*)$': `gatsby-core-utils/dist/$1`,
    '^gatsby-plugin-utils/(.*)$': [`gatsby-plugin-utils/dist/$1`, `gatsby-plugin-utils/$1`],
    '^csv-stringify/sync': '<rootDir>/node_modules/csv-stringify/dist/cjs/sync.cjs',
    'rehype-raw': '<rootDir>/__mocks__/react-markdown.js',
    'react-pdf': '<rootDir>/__mocks__/react-pdf.js',
  },
  modulePathIgnorePatterns: ['.cache'],
  testMatch: ['<rootDir>/**/**.spec.{js,jsx,ts,tsx}'],
  testPathIgnorePatterns: [`node_modules`, `.cache`, `public`],
  transformIgnorePatterns: [
    `node_modules/(?!(gatsby|d3|d3-color|d3-array|d3-scale|d3-shape|d3-selection|d3-time|d3-time-format|d3-transition|d3-interpolate|d3-axis|@react-pdf/renderer)/)`,
  ],
  globals: {
    __PATH_PREFIX__: ``,
    'ts-jest': {
      tsconfig: './tsconfig.spec.json',
    },
    TextEncoder: require('util').TextEncoder,
    TextDecoder: require('util').TextDecoder,
  },
  testEnvironment: 'jsdom',
  testEnvironmentOptions: { url: `http://localhost` },
  setupFiles: [`<rootDir>/loadershim.js`],
  verbose: true,
  setupFilesAfterEnv: [`<rootDir>/jest.setup.js`],
};
