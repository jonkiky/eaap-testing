import { test, expect } from '@playwright/test';

test('Explore page displays the number of files', async ({ page }) => {
  test.setTimeout(60_000);

  // 1. Navigate to Explore and verify the page is displayed.
  await page.goto('https://clinical.datacommons.cancer.gov/#/explore');

  await expect(page).toHaveURL(/\/#\/explore\/?$/);
  const participantFilters = page.getByRole('button', {
    name: 'Filter by Participants',
    exact: true,
  });

  // Fresh browser sessions display a government privacy notice.
  const warning = page.getByRole('dialog', { name: 'Warning', exact: true });
  await expect(warning.or(participantFilters).first()).toBeVisible({
    timeout: 30_000,
  });
  if (await warning.isVisible()) {
    await warning.getByRole('button', { name: 'Continue', exact: true }).click();
    await expect(warning).toBeHidden();
  }

  await expect(participantFilters).toBeVisible({ timeout: 30_000 });

  // 2. Verify the statistics bar is visible.
  const statisticsBar = page
    .locator('#statsbar_title_6')
    .locator('xpath=../../..');

  await expect(statisticsBar).toBeVisible({ timeout: 30_000 });

  // 3. Verify the FILES label and its numeric count are displayed.
  const filesLabel = statisticsBar.locator('#statsbar_title_6');
  const filesCount = statisticsBar.locator('#statsbar_count_6');

  await expect(filesLabel).toBeVisible();
  await expect(filesLabel).toHaveText('FILES');
  await expect(filesCount).toBeVisible();

  // Accept integers with or without thousands separators.
  await expect(filesCount).toHaveText(
    /^(?:\d+|\d{1,3}(?:,\d{3})+)$/,
    { timeout: 30_000 }
  );
});
