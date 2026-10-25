from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops
import io
def grab(path,vp,mob,scheme,sec):
    with sync_playwright() as p:
        b=p.chromium.launch(); ctx=b.new_context(viewport=vp,is_mobile=mob,has_touch=mob,color_scheme=scheme); pg=ctx.new_page()
        pg.goto('file://'+path); pg.wait_for_timeout(600)
        pg.evaluate("document.getElementById('openbtn').click()"); pg.wait_for_timeout(3600)
        pg.evaluate("document.querySelectorAll('.rv,.val').forEach(e=>e.classList.add('on'))")
        pg.evaluate(f"document.getElementById('{sec}').scrollIntoView()"); pg.wait_for_timeout(2500)
        pg.evaluate("window.scrollBy(0,150)"); pg.wait_for_timeout(2500)
        loaded=pg.evaluate("[...document.images].filter(i=>i.getBoundingClientRect().top<innerHeight&&i.getBoundingClientRect().bottom>0).every(i=>i.complete)")
        shot=pg.screenshot(); b.close(); return shot,loaded
for name,vp,mob,sec in [('laptop gallery',{'width':1366,'height':800},False,'gallery'),('phone about',{'width':390,'height':844},True,'about')]:
    for scheme in ['light','dark']:
        a,la=grab('/home/claude/site/index.html',vp,mob,scheme,sec); b,lb=grab('/home/claude/site2/index.html',vp,mob,scheme,sec)
        d=ImageChops.difference(Image.open(io.BytesIO(a)).convert('RGB'),Image.open(io.BytesIO(b)).convert('RGB'))
        n=sum(1 for px in d.getdata() if max(px)>12)
        print(name,scheme,'diff pixels',n,'imgs loaded old/new',la,lb)
