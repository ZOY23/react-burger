import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    experimentalMemoryManagement: true,
    video: false,
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium') {
          launchOptions.args.push('--disable-dev-shm-usage')
          launchOptions.args.push('--disable-gpu')
        }
        return launchOptions
      })
      
      // Для Windows-путей
      if (process.platform === 'win32') {
        config.projectRoot = config.projectRoot.replace(/\\/g, '/')
      }
      
      return config
    }
  },
  retries: {
    runMode: 2,
    openMode: 0
  }
})