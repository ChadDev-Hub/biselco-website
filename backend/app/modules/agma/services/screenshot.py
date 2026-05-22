from playwright.sync_api import sync_playwright
import asyncio
from dotenv import load_dotenv
import os
load_dotenv()
FRONTEND= os.getenv("FRONTEND_BASE_URL")
def _generate(id: str, path: str):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        
        page = browser.new_page(
            device_scale_factor=2,
        )

        page.goto(f"{FRONTEND}{path}?id={id}", wait_until="networkidle")

        ticket = page.locator(f"#agma-ticket")
        ticket.wait_for()
        screenshot = ticket.screenshot(omit_background=True)
        browser.close()
    return screenshot

async def generate_ticket(id: str, path: str):
    return await asyncio.to_thread(_generate, id, path)