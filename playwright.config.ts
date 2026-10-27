import {defineConfig} from '@playwright/test';

export default defineConfig({
  snapshotPathTemplate: '{testDir}/{testFileDir}/goldens/{arg}{ext}',
  testDir: './src',
  testMatch: /.*\.test\.ts/,
  timeout: 30000,
  use: {
    headless: true,
    viewport: {height: 600, width: 800},
  },
});
