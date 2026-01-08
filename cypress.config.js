const { defineConfig } = require("cypress");
require('dotenv').config();

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Scopic Tests',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    reporter: 'cypress-mochawesome-reporter',
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      // implement node event listeners here
    },
    testIsolation: false
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    STANDARD_USER: process.env.STANDARD_USER,
    LOCKED_USER: process.env.LOCKED_USER,
    VALID_PASSWORD: process.env.VALID_PASSWORD,
    INVALID_PASSWORD: process.env.INVALID_PASSWORD
  }
});