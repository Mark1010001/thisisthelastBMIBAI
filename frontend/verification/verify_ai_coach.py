from playwright.sync_api import sync_playwright, expect
import time

def verify_ai_coach():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # 1. Navigate to the app
        print("Navigating to http://localhost:5173")
        page.goto("http://localhost:5173")
        
        # 2. Login as guest
        print("Clicking CONTINUE AS GUEST")
        guest_button = page.get_by_text("CONTINUE AS GUEST")
        expect(guest_button).to_be_visible(timeout=10000)
        guest_button.click()
        
        # 3. Wait for dashboard and sidebar
        print("Waiting for dashboard")
        page.wait_for_selector("aside", timeout=10000)
        
        # 4. Click on AI Coach tab
        print("Clicking AI Coach tab")
        page.get_by_role("button", name="AI Coach").click()
        
        # 5. Check if the AI coach advice is visible
        print("Checking AI Coach advice")
        expect(page.get_by_text("Smart Health Coach")).to_be_visible()
        
        # 6. Take a screenshot
        page.screenshot(path="verification/ai_coach_initial.png")
        print("Initial screenshot taken.")
        
        # 7. Change metrics to trigger refresh (e.g. increase age)
        # Switch back to inputs tab
        print("Switching to Inputs tab")
        page.get_by_role("button", name="Inputs").click()
        
        # Increment age
        print("Incrementing age")
        # Age is the first NumberInput, let's find the second button in it (the Plus button)
        age_input_container = page.locator("div:has-text('AGE')").first
        plus_button = age_input_container.locator("button").nth(1)
        plus_button.click() 
        plus_button.click() 
        plus_button.click()
        plus_button.click()
        plus_button.click()
        
        time.sleep(2) # Wait for backend calculation
        
        # 8. Switch back to AI Coach and verify change
        print("Switching back to AI Coach tab")
        page.get_by_role("button", name="AI Coach").click()
        page.screenshot(path="verification/ai_coach_updated.png")
        print("Updated screenshot taken.")
        
        browser.close()

if __name__ == "__main__":
    import os
    if not os.path.exists("verification"):
        os.makedirs("verification")
    try:
        verify_ai_coach()
    except Exception as e:
        print(f"Error: {e}")
