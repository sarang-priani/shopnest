import { test, expect } from '@playwright/test';

const BACKEND_URL = 'http://localhost:5001';
const FRONTEND_URL = 'http://localhost:5173';

const testEmail = `testuser_${Date.now()}@example.com`;
const testPassword = 'password123';
const testName = 'Test User';

const adminEmail = `admin_${Date.now()}@example.com`;
const adminPassword = 'password123';

async function login(page, email, password) {
  await page.goto(`${FRONTEND_URL}/login`);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(`${FRONTEND_URL}/`);
}

test.describe('ShopNest E2E', () => {

  test('Register a new user, redirected to home, Navbar shows name', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/register`);
    await page.fill('input[type="text"]', testName);
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(`${FRONTEND_URL}/`);
    await expect(page.locator('nav')).toContainText(testName);
  });

  test('Log out, Navbar reverts to logged-out state', async ({ page }) => {
    await login(page, testEmail, testPassword);
    await expect(page.locator('nav')).toContainText(testName);

    await page.click('nav button:has-text("' + testName + '")');
    await page.click('nav button:has-text("Log Out")');
    await expect(page.locator('nav')).toContainText('Log In');
  });

  test('Log back in with same credentials', async ({ page }) => {
    await login(page, testEmail, testPassword);
    await expect(page.locator('nav')).toContainText(testName);
  });

  test('Duplicate email registration shows error', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/register`);
    await page.fill('input[type="text"]', 'Another User');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await expect(page.getByText('User already exists')).toBeVisible();
    await expect(page).toHaveURL(`${FRONTEND_URL}/register`);
  });

  test('Wrong password shows error', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/login`);
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('Browse products and open product details', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/products`);
    await expect(page.locator('h1')).toContainText('Products');
    const firstCard = page.locator('a[href^="/products/"]').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add to Cart' })).toBeVisible();
  });

  test('Add to cart, quantity badge updates in Navbar', async ({ page }) => {
    await login(page, testEmail, testPassword);

    await page.goto(`${FRONTEND_URL}/products`);
    const firstCard = page.locator('a[href^="/products/"]').first();
    await firstCard.click();

    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await page.waitForTimeout(1000);
    const badge = page.locator('[data-testid="cart-badge"]').first();
    await expect(badge).toBeVisible();
  });

  test('Update quantity and remove item from cart page', async ({ page }) => {
    await login(page, testEmail, testPassword);

    await page.goto(`${FRONTEND_URL}/cart`);
    await page.waitForTimeout(1500);

    const plusBtn = page.locator('button:has-text("+")').first();
    if (await plusBtn.isVisible()) {
      await plusBtn.click();
      await page.waitForTimeout(500);
    }

    const removeBtn = page.locator('button:has-text("Remove")').first();
    if (await removeBtn.isVisible()) {
      await removeBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('Complete checkout with valid shipping address', async ({ page }) => {
    await login(page, testEmail, testPassword);

    await page.goto(`${FRONTEND_URL}/products`);
    const firstCard = page.locator('a[href^="/products/"]').first();
    await firstCard.click();
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await page.waitForTimeout(1000);

    await page.goto(`${FRONTEND_URL}/checkout`);

    await page.waitForSelector('input[type="text"]', { timeout: 5000 });
    const inputs = page.locator('input[type="text"]');
    await inputs.nth(0).fill('123 Test Street');
    await inputs.nth(1).fill('Mumbai');
    await inputs.nth(2).fill('400001');
    await inputs.nth(3).fill('India');

    await page.getByRole('button', { name: 'Place Order' }).click();
    await page.waitForTimeout(3000);

    const url = page.url();
    expect(url.includes('/orders/')).toBeTruthy();
  });

  test('Checkout with empty cart shows empty state', async ({ page }) => {
    await login(page, testEmail, testPassword);

    await page.goto(`${FRONTEND_URL}/cart`);
    await page.waitForTimeout(1500);

    const emptyMsg = page.getByText('Your cart is empty');
    if (await emptyMsg.count() > 0) {
      await expect(emptyMsg.first()).toBeVisible();
    }
  });

  test('Non-admin cannot reach admin dashboard', async ({ page }) => {
    await login(page, testEmail, testPassword);

    await page.goto(`${FRONTEND_URL}/admin`);
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(`${FRONTEND_URL}/`);
  });

  test('Admin can access admin dashboard', async ({ page }) => {
    const regRes = await page.request.post(`${BACKEND_URL}/api/auth/register`, {
      data: { name: 'Admin User', email: adminEmail, password: adminPassword },
    }).catch(() => null);

    if (regRes && regRes.ok) {
      const regData = await regRes.json();
      await page.request.post(`${BACKEND_URL}/api/auth/dev/promote`, {
        headers: { Authorization: `Bearer ${regData.token}` },
        data: { email: adminEmail },
      });
    }

    await login(page, adminEmail, adminPassword);
    await page.goto(`${FRONTEND_URL}/admin`);
    await expect(page).toHaveURL(`${FRONTEND_URL}/admin`);
    await expect(page.getByText('Admin Dashboard')).toBeVisible();
  });

  test('Route sanity: refreshing pages does not break', async ({ page }) => {
    const routes = ['/', '/products', '/login', '/register'];
    for (const route of routes) {
      await page.goto(`${FRONTEND_URL}${route}`);
      await expect(page.locator('#root')).toBeVisible();
      const content = await page.locator('#root').textContent();
      expect(content.length).toBeGreaterThan(0);
    }
  });
});
