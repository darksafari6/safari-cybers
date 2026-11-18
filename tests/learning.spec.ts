import { expect, test } from '@playwright/test';

test('opens a room, completes a lesson and keeps progress after refresh', async ({ page }) => {
  await page.goto('/');
  const room = page.locator('#learning-rooms').getByRole('button').first();
  await room.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#\/rooms\/1$/);
  await expect(page.getByRole('main')).toBeFocused();
  await page.getByRole('button', { name: 'Start Lessons' }).click();
  await expect(page).toHaveURL(/#\/rooms\/1\/lessons$/);
  await page.getByRole('button', { name: 'Complete & Continue' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Previous Task' })).toBeEnabled();
  await page.getByRole('button', { name: 'Close lessons' }).click();
  await expect(page.getByText(/^1 of \d+ lessons completed$/)).toBeVisible();
});

test('opens a learning path directly on mobile and supports browser history', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/#/paths/1');
  await expect(page.getByRole('heading', { name: 'Junior Penetration Tester' })).toBeVisible();
  await page.getByRole('button', { name: 'Back to Dashboard' }).click();
  await expect(page.getByRole('heading', { name: 'Learning Rooms' })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Junior Penetration Tester' })).toBeVisible();
});

test('follows the defensive sequence and opens course reading', async ({ page }) => {
  await page.goto('/#/paths/4');
  await page.getByRole('button', { name: 'Continue: Networking for Defenders' }).click();
  await expect(page.getByRole('link', { name: /Crash Course Computer Science/ })).toHaveAttribute('href', /youtube\.com\/watch\?v=/);
  await page.getByRole('button', { name: 'Start Lessons' }).click();
  await expect(page.getByRole('heading', { name: /Names, addresses, and applications/ })).toBeVisible();
  await page.getByRole('button', { name: 'Complete & Continue' }).click();
  await expect(page.getByRole('heading', { name: /Evidence before conclusions/ })).toBeVisible();
  for (let i = 0; i < 2; i++) await page.getByRole('button', { name: 'Complete & Continue' }).click();
  await page.getByRole('button', { name: 'Complete Room' }).click();
  await page.goto('/#/paths/4');
  await expect(page.getByRole('button', { name: 'Continue: Secure Change Review with Git' })).toBeVisible();
});

test('reads and shares standalone book chapters without changing lesson progress', async ({ page }) => {
  await page.goto('/#/rooms/5');
  await page.getByRole('link', { name: 'Read chapter 1' }).click();
  await expect(page.getByRole('heading', { name: /Names, addresses, and applications/ })).toBeVisible();
  await page.getByRole('link', { name: /Next chapter/ }).click();
  await expect(page).toHaveURL(/\/book\/2$/);
  await page.reload();
  await expect(page.getByRole('heading', { name: /Evidence before conclusions/ })).toBeVisible();
  await page.getByRole('link', { name: /Back to course/ }).click();
  await expect(page.getByText('0 of 4 lessons completed')).toBeVisible();
});

test('preserves reader preferences and bookmarks and filters the academy library', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto('/#/rooms/5/book/1');
  await page.getByRole('button', { name: 'Dark theme' }).click();
  await page.getByRole('button', { name: 'Larger text' }).click();
  await page.getByRole('button', { name: 'Bookmark', exact: true }).click();
  await page.getByText('Reveal the model answer').click();
  await expect(page.getByText('Model approach:', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Mark chapter as read' }).click();
  await page.reload();
  for (const name of ['Dark theme', 'Larger text', 'Bookmark', 'Marked as read']) {
    await expect(page.getByRole('button', { name, exact: true })).toHaveAttribute('aria-pressed', 'true');
  }
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Open last chapter' })).toHaveAttribute('href', '#/rooms/5/book/1');
  await expect(page.getByRole('heading', { name: 'Bookmarked chapters' })).toBeVisible();
  await page.getByRole('searchbox', { name: 'Search courses' }).fill('regional sign-in');
  await expect(page.locator('#learning-rooms').getByRole('button')).toHaveCount(1);
  await expect(page.locator('#learning-rooms').getByRole('button')).toContainText('Regional Sign-in Incident');
});
