import { test, expect } from '@playwright/test';

test('Verify Auto-Create KB Agent Checkbox Functionality', async ({ page }) => {
  // Navigate to the Create KB Admin tool
  await page.goto('/create-kb-admin');
  await expect(page).toHaveTitle('Create KB Admin Tool');

  // Create a Knowledge Base with 'Auto-Create KB Agent' checkbox cleared
  const kbNameInput = page.getByLabel('Knowledge Base Name');
  const autoCreateCheckbox = page.getByLabel('Auto-Create KB Agent');
  const createButton = page.getByRole('button', { name: 'Create Knowledge Base' });

  await kbNameInput.fill('TestKB');
  await autoCreateCheckbox.uncheck();
  await createButton.click();

  // Verify the Knowledge Base is created without an agent
  await expect(page.getByText('Knowledge Base created successfully')).toBeVisible();
  await expect(page.getByText('Agent created automatically')).toBeHidden();

  // Check if the user can manually create an agent later
  const manualCreateButton = page.getByRole('button', { name: 'Manually Create Agent' });
  await expect(manualCreateButton).toBeVisible();
  await manualCreateButton.click();

  await expect(page.getByText('Agent creation interface is now visible')).toBeVisible();
});
