
from playwright.sync_api import sync_playwright
import time

def verify_channel_badges():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Log all types of messages
        page.on("console", lambda msg: print(f"Console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Page Error: {err}"))

        # Mocks
        page.route("**/player_api.php*", lambda route: route.fulfill(
            status=200,
            body='{"user_info":{"status":"Active","exp_date":"1700000000","username":"user","password":"password","auth":1},"server_info":{"url":"http://test.com","port":"80","https_port":"443","server_protocol":"http"}}',
            content_type="application/json"
        ))

        page.route("**/get_live_categories*", lambda route: route.fulfill(
            status=200,
            body='[{"category_id":"1","category_name":"Test Category","parent_id":0}]',
            content_type="application/json"
        ))

        page.route("**/get_live_streams*", lambda route: route.fulfill(
            status=200,
            body='[{"num":1,"name":"Test Channel 4K HEVC","stream_type":"live","stream_id":1,"stream_icon":"","epg_channel_id":"","added":"1600000000","category_id":"1","custom_sid":"","tv_archive":0,"direct_source":"","tv_archive_duration":0}]',
            content_type="application/json"
        ))

        print("Navigating to app...")
        page.goto("http://localhost:5173")

        # Wait for hash routing
        page.wait_for_timeout(2000)

        try:
             # Fill Login Form
             # Use placeholders or iterate inputs
             # Assuming standard inputs: URL, User, Pass
             page.locator('input').nth(0).fill("http://test.com")
             page.locator('input').nth(1).fill("user")
             page.locator('input[type="password"]').fill("pass")

             page.click("button")
             print("Login clicked")

             # Wait for navigation
             page.wait_for_url("**/dashboard", timeout=5000)
             print("Logged in, on Dashboard")

             # Navigate to Live TV (Assuming there is a button or we can go directly)
             # Let's try direct navigation
             page.goto("http://localhost:5173/#/live")

             print("Waiting for 'Test Category'...")
             page.wait_for_selector("text=Test Category", timeout=5000)
             print("Category found")

             # Need to select category to see channels?
             # Based on code, CategoryList displays categories. ChannelList displays channels.
             # LiveStore fetches categories on mount.
             # Select first category?
             # Usually selecting category fetches streams.

             page.click("text=Test Category")
             print("Category clicked")

             # Check for badges
             print("Checking for badges...")
             page.wait_for_selector("text=Test Channel 4K HEVC", timeout=5000)

             # Check for 4K badge
             if page.locator("text=4K").count() > 0:
                 print("Found 4K badge")
             else:
                 print("4K badge not found")

             page.screenshot(path="verification/dashboard_badges.png")

             # Click channel to play
             page.click("text=Test Channel 4K HEVC")
             print("Channel clicked")

             # Wait a bit for overlay
             page.wait_for_timeout(2000)

             page.screenshot(path="verification/player_overlay.png")

        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error_state.png")

        browser.close()

if __name__ == "__main__":
    verify_channel_badges()
