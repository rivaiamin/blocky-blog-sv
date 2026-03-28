import { defineConfig } from '@playwright/test';

const databaseUrl = process.env.DATABASE_URL ?? 'postgres://localhost:5432/blocky_blog_sv';
const origin = process.env.ORIGIN ?? 'http://localhost:4173';
const authSecret = process.env.BETTER_AUTH_SECRET ?? 'e2e-test-secret-must-be-at-least-32-chars';

export default defineConfig({
	webServer: {
		command: 'pnpm db:push && pnpm build && pnpm preview -- --port 4173 --host 127.0.0.1',
		port: 4173,
		env: {
			...process.env,
			DATABASE_URL: databaseUrl,
			ORIGIN: origin,
			BETTER_AUTH_SECRET: authSecret
		}
	},
	testMatch: '**/*.e2e.{ts,js}'
});
