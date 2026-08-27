import { defineIcmsVitestConfig } from "@iqual/nuxt-icms-dev/vitest";

// Project-owned wrapper around the shared ICMS Vitest config (created once by
// iqual/drupal-nuxt-platform, never overwritten). `bun run test:ci` runs the
// product specs shipped in @iqual/nuxt-icms* together with this project's own
// specs (app/**/__tests__, server/**/__tests__, shared/**/__tests__, tests/).
// Pass Vitest overrides to adapt it — e.g. exclude a product spec the project
// deliberately deviates from:
//
//   test: { exclude: ['node_modules/@iqual/nuxt-icms/__tests__/pages.spec.ts'] },
export default defineIcmsVitestConfig({});
