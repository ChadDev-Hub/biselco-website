from playwright.sync_api import sync_playwright
from playwright.async_api import async_playwright
import asyncio
from dotenv import load_dotenv
from PIL import Image
from io import BytesIO
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
load_dotenv()


class GetTicketServices:
    def __init__(self):
        self.FRONTEND = os.getenv("FRONTEND_BASE_URL")

    def generate(self, id: str, path: str):
        with sync_playwright() as p:
            browser = p.chromium.launch()

            page = browser.new_page(
                device_scale_factor=2,
            )

            page.goto(f"{self.FRONTEND}{path}?id={id}",
                      wait_until="networkidle")

            ticket = page.locator(f"#agma-ticket")
            ticket.wait_for()
            screenshot = ticket.screenshot(omit_background=True)
            browser.close()
        return screenshot

    async def generate_ticket(self, id: str, path: str):
        return await asyncio.to_thread(self.generate, id, path)

    async def ticket_to_pdf(self, id: str, path: str, token: str, refresh_token: str):
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            context = await browser.new_context(
                device_scale_factor=1,
                base_url="http://frontend-dev:3000",
            )

            await context.add_cookies(
                [{
                    "name": "access_token",
                    "value": str(token),
                    "url": "http://frontend-dev:3000",
                },
                    {
                    "name": "refresh_token",
                    "value": str(refresh_token),
                    "url": "http://frontend-dev:3000",

                }]
            )

            page = await context.new_page()
            await page.add_init_script(
                """localStorage.setItem("LoginStatus", "true");"""
            )

            await page.goto(path, wait_until="networkidle")

            await page.wait_for_selector(id)
            tickets = page.locator(id)
            images = []
            count = await tickets.count()

            for ticket in range(count):
                screenshot = await tickets.nth(ticket).screenshot(omit_background=True)
                images.append(Image.open(BytesIO(screenshot)))
            await browser.close()

        return await self.convert_to_pdf(images)

    async def convert_to_pdf(self, images: list):
        pdf = BytesIO()

        PAGE_W, PAGE_H = letter
        c = canvas.Canvas(pdf, pagesize=letter)
        cell_w = PAGE_W // 2
        cell_h = PAGE_H // 2
        for start in range(0, len(images), 4):

            for idx, img in enumerate(images[start:start+4]):
                row = idx // 2
                col = idx % 2

                img = img.copy()
                img.thumbnail((cell_w - 60, cell_h-60))

                x = col * cell_w + (cell_w - img.width) / 2
                y = PAGE_H - ((row + 1) * cell_h) + (cell_h - img.height) / 2

                reader = ImageReader(img)
                c.drawImage(reader, x, y, width=img.width,
                            height=img.height, mask="auto", preserveAspectRatio=True)
            c.showPage()
        c.save()

        pdf.seek(0)

        return pdf.getvalue()
