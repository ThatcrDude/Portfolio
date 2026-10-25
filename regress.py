from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops
import io
def shots(path,tag):
    out={}
    with sync_playwright() as p:
        b=p.chromium.launch()
        for name,vp,mob in [('laptop',{'width':1366,'height':800},False),('phone',{'width':390,'height':844},True)]:
            for scheme in ['light','dark']:
                ctx=b.new_context(viewport=vp,is_mobile=mob,has_touch=mob,color_scheme=scheme); pg=ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
                pg.goto('file://'+path); pg.wait_for_timeout(700)
                out[(name,scheme,'closed')]=pg.screenshot()
                pg.evaluate("document.getElementById('openbtn').click()"); pg.wait_for_timeout(3600)
                out[(name,scheme,'open')]=pg.screenshot()
                if not mob:
                    for v in ['about','contact']:
                        pg.evaluate(f"document.querySelector('.tab[data-view={v}]').click()"); pg.wait_for_timeout(2600); out[(name,scheme,v)]=pg.screenshot()
                    pg.evaluate("document.querySelector('.tab[data-view=work]').click()"); pg.wait_for_timeout(1500)
                pg.evaluate("window.scrollTo(0,innerHeight*1.0)"); pg.wait_for_timeout(1500); out[(name,scheme,'highlights')]=pg.screenshot()
                pg.evaluate("document.querySelectorAll('.rv,.val').forEach(e=>e.classList.add('on'))")
                for sec in ['about','gallery','videos','resume']:
                    el=pg.query_selector('#'+sec)
                    if el and el.is_visible():
                        pg.evaluate(f"document.getElementById('{sec}').scrollIntoView()"); pg.wait_for_timeout(500); out[(name,scheme,sec)]=pg.screenshot()
                out[(name,scheme,'errors')]=errs
                ctx.close()
        b.close()
    return out
a=shots('/home/claude/site/index.html','old'); b=shots('/home/claude/site2/index.html','new')
bad=0
for k in a:
    if k[2]=='errors':
        print(k,'old errors',a[k],'new errors',b[k]); continue
    ia=Image.open(io.BytesIO(a[k])).convert('RGB'); ib=Image.open(io.BytesIO(b[k])).convert('RGB')
    d=ImageChops.difference(ia,ib); bb=d.getbbox()
    n=sum(1 for px in d.getdata() if max(px)>12) if bb else 0
    flag='' if n<200 else '  <-- DIFFERENT'
    if n>=200: bad+=1
    print(k,'diff pixels:',n,flag)
print('screens compared:',len([k for k in a if k[2]!='errors']),'different:',bad)
