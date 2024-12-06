const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:9000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  retries: 2,
  defaultCommandTimeout: 10000,
});
