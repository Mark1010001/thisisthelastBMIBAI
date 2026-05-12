from playwright.sync_api import sync_playwright, expect
import time

def verify_ai_chatbot():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # 1. Login as guest
        page.goto("http://localhost:5173")
        page.get_by_role("button", name="Continue as Guest").click()
        
        # 2. Wait for dashboard and navigate to AI Coach tab
        page.wait_for_selector("aside")
        page.get_by_role("button", name="AI Coach").click()
        
        # 3. Check for initial message
        expect(page.get_by_text("Hello! I'm your AI Health Coach")).to_be_visible()
        
        # 4. Send a message
        input_field = page.get_by_placeholder("Ask your health coach...")
        input_field.fill("What is BMI?")
        page.get_by_role("button").filter(has=page.locator("svg.lucide-send")).click()
        
        # 5. Wait for response (look for the bot icon or specific text)
        page.wait_for_selector("div.animate-spin", state="hidden") # wait for loader to disappear
        
        # Wait a bit for the response to render
        time.sleep(2)
        
        # 6. Take screenshot
        page.screenshot(path="/home/jules/verification/verify_chatbot.png")
        print("Screenshot saved to /home/jules/verification/verify_chatbot.png")
        
        browser.close()

if __name__ == "__main__":
    verify_ai_chatbot()
