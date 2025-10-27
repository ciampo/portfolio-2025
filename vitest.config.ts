/// <reference types="vitest/config" />
import { configDefaults } from "vitest/config";
import { getViteConfig } from "astro/config";
import { playwright } from "@vitest/browser-playwright";

export default getViteConfig({
  optimizeDeps: {
    exclude: ["chromium-bidi", "fsevents"],
  },
  test: {
    exclude: [...configDefaults.exclude, "tests/**"],
    browser: {
      provider: playwright({
        launchOptions: {
          slowMo: 100,
        },
      }),
      enabled: true,
      headless: true, // move to different CLI commands
      instances: [
        {
          browser: "chromium",
        },
      ],
    },
  },
});
