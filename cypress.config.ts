import cypress, { defineConfig } from 'cypress'
 
export default defineConfig({
  defaultCommandTimeout: 10000,
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.ts')(on, config)
    },
    baseUrl: 'http://localhost:3000'
  },
  chromeWebSecurity: false,
})