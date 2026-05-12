from playwright.sync_api import sync_playwright, expect
import time
import re

def verify_ai_coach_updates():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Login as guest
        page.goto("http://localhost:5173")
        page.get_by_role("button", name="Continue as Guest").click()

        # 2. Go to AI Coach tab
        page.wait_for_selector("aside")
        page.get_by_role("button", name="AI Coach").click()

        # 3. Take initial screenshot
        time.sleep(2)
        page.screenshot(path="/home/jules/verification/coach_v1_initial.png")

        # 4. Change metrics (Inputs tab)
        page.get_by_role("button", name="Inputs").click()

        # Weight is the second spinbutton
        weight_input = page.get_by_role("spinbutton").nth(1)

        weight_input.fill("120")
        weight_input.press("Enter")

        time.sleep(2) # wait for calculation

        # 5. Go back to AI Coach tab and verify update
        page.get_by_role("button", name="AI Coach").click()
        time.sleep(2)

        # Take updated screenshot
        page.screenshot(path="/home/jules/verification/coach_v2_updated.png")

        # Verify the "Live Assessment" or the new message exists
        expect(page.get_by_text("I've updated my assessment")).to_be_visible()

        print("Screenshots saved to /home/jules/verification/")
        browser.close()

if __name__ == "__main__":
    verify_ai_coach_updates()
