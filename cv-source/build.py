"""Rebuild the CV: python3 build.py  (needs: pip install playwright && playwright install chromium; poppler's pdftoppm)
Writes assets/Lim_Cheng_Rui_CV.pdf, assets/cv-page-1.jpg and assets/cv-page-2.jpg."""
import pathlib, subprocess
from playwright.sync_api import sync_playwright
here = pathlib.Path(__file__).resolve().parent
assets = here.parent / "assets"
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.goto((here / "cv.html").as_uri())
    pg.wait_for_timeout(400)
    pg.pdf(path=str(assets / "Lim_Cheng_Rui_CV.pdf"), format="A4", print_background=True,
           margin=dict(top="0", right="0", bottom="0", left="0"))
    b.close()
subprocess.run(["pdftoppm", "-jpeg", "-jpegopt", "quality=88", "-scale-to-x", "1405", "-scale-to-y", "1988",
                str(assets / "Lim_Cheng_Rui_CV.pdf"), str(assets / "cv-page")], check=True)
print("done")
