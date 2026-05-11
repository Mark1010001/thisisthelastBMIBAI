from playwright.sync_api import sync_playwright, expect
import time

def test_bmi_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create a large viewport to capture the whole dashboard
        page = browser.new_page(viewport={'width': 1600, 'height': 1200})

        try:
            # Go to the frontend
            print("Navigating to http://localhost:5173...")
            page.goto("http://localhost:5173")

            # Wait for the app to load and data to be fetched
            print("Waiting for app to load...")
            page.wait_for_selector("h1:has-text('BMI Health Risk Classifier')")

            # Wait a bit more for charts to render
            time.sleep(5)

            # Check if calculator is visible
            expect(page.get_by_text("Your BMI + BAI Calculator")).to_be_visible()

            # Take a screenshot
            print("Taking screenshot...")
            page.screenshot(path="/home/jules/verification/bmi_app_verified.png", full_page=True)
            print("Screenshot saved to /home/jules/verification/bmi_app_verified.png")

        except Exception as e:
            print(f"Error: {e}")
            # Take a screenshot even if it fails to see why
            page.screenshot(path="/home/jules/verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    test_bmi_app()
