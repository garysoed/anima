import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './src',
  testMatch: /.*\.test\.ts/,
  timeout: 30000,
  use: {
    headless: true,
    viewport: {width: 800, height: 600},
  },
});
