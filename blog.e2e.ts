import { expect, test } from '@playwright/test';

test.describe('blog smoke', () => {
	test('home loads', async ({ page }) => {
		const res = await page.goto('/');
		expect(res?.ok()).toBeTruthy();
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	});

	test('unknown post returns 404', async ({ page }) => {
		const res = await page.goto('/post/does-not-exist-slug-xyz');
		expect(res?.status()).toBe(404);
	});
});
