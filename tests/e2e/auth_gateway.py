from pathlib import Path
from playwright.sync_api import sync_playwright

BASE_URL = 'http://127.0.0.1:43128'
ARTIFACTS = Path('tmp/auth-e2e')
ARTIFACTS.mkdir(parents=True, exist_ok=True)

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 390, 'height': 844})
    errors = []
    page.on('console', lambda message: errors.append(message.text) if message.type == 'error' else None)
    page.goto(f'{BASE_URL}/auth/login', wait_until='domcontentloaded')
    page.locator('input[type="email"]').wait_for(state='visible')
    page.get_by_role('button', name='Appearance').click()
    assert page.locator('.auth-mini-themes button').count() == 8

    directions = {'DE': 'ltr', 'EN': 'ltr', 'FA': 'rtl', 'AR': 'rtl'}
    for language, direction in directions.items():
        page.locator('.auth-mini-languages button', has_text=language).click()
        assert page.locator('html').get_attribute('dir') == direction
    page.screenshot(path=str(ARTIFACTS / 'auth-mobile-rtl.png'), full_page=True)
    assert not errors, errors
    page.close()

    page = browser.new_page(viewport={'width': 390, 'height': 844})
    page.goto(f'{BASE_URL}/', wait_until='domcontentloaded')
    page.wait_for_timeout(5000)
    close = page.locator('.buffet-campaign-modal .modal-close')
    if close.count():
        close.click()
    assert page.locator('.mobile-bottom-nav button').all_inner_texts()[-1] == 'Mein Konto'
    page.locator('.mobile-bottom-nav button').last.click()
    page.wait_for_timeout(1000)
    assert '/auth/login' in page.url and 'returnTo=%2Faccount' in page.url
    browser.close()
