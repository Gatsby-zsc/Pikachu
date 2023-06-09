import { join } from "path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [
      ...configDefaults.exclude,
      "**/playwright/**",
      "**/playwright-examples/**",
    ],
  },
  resolve: {
    alias: {
      "@/": join(__dirname, "./src/"),
    },
  },
});
