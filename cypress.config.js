import "dotenv/config";
import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: process.env.APP_URL || "http://localhost:6969",
        viewportHeight: 1080,
        viewportWidth: 1920,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
