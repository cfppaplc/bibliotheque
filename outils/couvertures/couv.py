import base64,html
F=lambda n:base64.b64encode(open(''+__import__('os').path.dirname(__file__)+'/%s.woff'%n,'rb').read()).decode()
FONTS="".join("@font-face{font-family:%s;src:url(data:font/woff;base64,%s) format('woff')}"%(n,F(n)) for n in ['MPI5','MPI6','MPI8','MPD9'])
PROG={'egi':('#1B7A55','ENTRETIEN GÉNÉRAL D\'IMMEUBLES','DEP 5211'),'plc':('#1F5FAD','PLOMBERIE ET CHAUFFAGE','DEP 5333')}
CSS=FONTS+"""
.mpc text{font-kerning:normal}
.mpw.att .mpc .a,.mpw.att .mpc .bdg{opacity:0}.mpw.att .mpc .bar{transform:scaleX(0)}
.mpc .bar,.mpc .bdg{transform-box:fill-box}.mpc .bar{transform-origin:left}.mpc .bdg{transform-origin:center}
.mpw.go .mpc .a{opacity:0;animation:mpUp .8s cubic-bezier(.2,.8,.2,1) forwards}
.mpw.go .mpc .bar{transform:scaleX(0);animation:mpBar .6s 1.1s ease-out forwards}
.mpw.go .mpc .bdg{opacity:0;animation:mpPop .6s .1s cubic-bezier(.3,1.5,.5,1) forwards}
@keyframes mpUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes mpBar{to{transform:scaleX(1)}}
@keyframes mpPop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
"""
def e(s):return html.escape(s,quote=True)
def couverture(t1,t2,sous,num,prog,code,heures,acc,fonce,photo=None,logo=''):
    pc,pnom,dep=PROG[prog]
    img=(f'<image href="{photo}" x="0" y="0" width="612" height="470" preserveAspectRatio="xMidYMid slice"/>' if photo
         else f'<rect width="612" height="470" fill="{fonce}"/><text x="306" y="250" text-anchor="middle" font-family="MPI6" font-size="14" fill="#ffffff66">PHOTO À VENIR</text>')
    tz=min(64,int(530/(max(len(t1),len(t2))*0.71)))
    d=lambda i:f'style="animation-delay:{.3+i*.18:.2f}s"'
    return f'''<svg class="mpc" viewBox="0 0 612 792" width="816" height="1056" style="position:absolute;inset:0">
<style>{CSS}</style>
<rect width="612" height="792" fill="#fff"/>{img}
<defs><linearGradient id="mph" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14181c" stop-opacity=".9"/><stop offset=".42" stop-color="#14181c" stop-opacity="0"/></linearGradient></defs>
<rect width="612" height="470" fill="url(#mph)"/>
<rect x="0" y="0" width="14" height="792" fill="{pc}"/>
<rect y="466" width="612" height="6" fill="{acc}"/>
<g class="a" {d(0)}><text x="48" y="62" font-family="MPI8" font-size="11" letter-spacing="3" fill="#fff">{dep}</text>
<text x="48" y="80" font-family="MPI8" font-size="11" letter-spacing="2" fill="#fff">{e(pnom)}</text>
<text x="48" y="97" font-family="MPI6" font-size="10" letter-spacing="2" fill="#fff">{e(code)}{(' · '+heures+' HEURES') if heures else ''}</text></g>
<g class="bdg"><rect x="480" y="34" width="96" height="96" rx="24" fill="#1E2A44"/>
<text x="{518 if len(str(num))<2 else 516}" y="{106 if len(str(num))<2 else 102}" text-anchor="middle" font-family="MPD9" font-size="{62 if len(str(num))<2 else 44}" fill="#fff">{num}</text>
<rect x="539" y="44" width="26" height="26" rx="8" fill="#F2762E"/><path d="M552 50v14M545 57h14" stroke="#fff" stroke-width="4.2" stroke-linecap="round"/></g>
<text class="a" {d(1)} x="48" y="548" font-family="MPD9" font-size="{tz}" fill="#1e2a33">{e(t1)}</text>
<text class="a" {d(2)} x="48" y="610" font-family="MPD9" font-size="{tz}" fill="{acc}">{e(t2)}</text>
<text class="a" {d(3)} x="50" y="638" font-family="MPI5" font-size="14" fill="#4a5560">{e(sous)}</text>
<rect class="bar" x="50" y="652" width="90" height="4" fill="{acc}"/>
<g font-family="MPI6" font-size="10" fill="#5a636b">
<text x="50" y="690">Nom de l'élève</text><line x1="140" y1="690" x2="330" y2="690" stroke="#9aa3aa"/>
<text x="50" y="714">Code permanent</text><line x1="140" y1="714" x2="330" y2="714" stroke="#9aa3aa"/>
<text x="350" y="690">Groupe</text><line x1="392" y1="690" x2="562" y2="690" stroke="#9aa3aa"/>
<text x="350" y="714">Enseignant</text><line x1="410" y1="714" x2="562" y2="714" stroke="#9aa3aa"/></g>
<text x="316" y="738" text-anchor="middle" font-family="MPI5" font-size="7.5" fill="#5a636b">© 2026 Jérémy Raymond. Tous droits réservés. Reproduction interdite sans autorisation écrite de l'auteur.</text>
<rect x="14" y="748" width="598" height="44" fill="#eef0f1"/>
<text x="50" y="773" font-family="MPI8" font-size="8" letter-spacing="1" fill="#24282c">SOURCE : JÉRÉMY RAYMOND, ENSEIGNANT</text>
<text x="482" y="773" text-anchor="end" font-family="MPI8" font-size="8" letter-spacing="1" fill="#24282c">TOUS DROITS RÉSERVÉS</text>
{logo}
</svg>'''
def fin(t1,t2,num,prog,acc,fonce,resume,logo=''):
    pc,pnom,dep=PROG[prog]
    lignes=''.join(f'<text x="306" y="{470+i*22}" text-anchor="middle" font-family="MPI5" font-size="14" fill="#c9d1d8">{e(l)}</text>' for i,l in enumerate(resume))
    return f'''<svg class="mpc" viewBox="0 0 612 792" width="816" height="1056" style="position:absolute;inset:0">
<style>{CSS}</style>
<rect width="612" height="792" fill="{fonce}"/><rect x="0" y="0" width="14" height="792" fill="{pc}"/>
<g class="bdg"><rect x="258" y="186" width="96" height="96" rx="24" fill="#2b3a5a"/>
<text x="{296 if len(str(num))<2 else 294}" y="{258 if len(str(num))<2 else 254}" text-anchor="middle" font-family="MPD9" font-size="{62 if len(str(num))<2 else 44}" fill="#fff">{num}</text>
<rect x="317" y="196" width="26" height="26" rx="8" fill="#F2762E"/><path d="M330 202v14M323 209h14" stroke="#fff" stroke-width="4.2" stroke-linecap="round"/></g>
<text class="a" {''} x="306" y="350" text-anchor="middle" font-family="MPD9" font-size="40" fill="#fff">{e(t1)}</text>
<text class="a" style="animation-delay:.25s" x="306" y="395" text-anchor="middle" font-family="MPD9" font-size="40" fill="{acc}">{e(t2)}</text>
<rect class="bar" x="276" y="420" width="60" height="4" fill="{acc}"/>
<g class="a" style="animation-delay:.45s">{lignes}</g>
<text x="306" y="650" text-anchor="middle" font-family="MPI8" font-size="9" letter-spacing="2" fill="#8a96a0">{dep} · {e(pnom)}</text>
{logo}
<text x="306" y="760" text-anchor="middle" font-family="MPI5" font-size="8" fill="#8a96a0">© 2026 Jérémy Raymond. Tous droits réservés.</text>
</svg>'''

JS="""<script>(function(){var s=document.currentScript,w=s.parentNode,sec=w.parentNode;w.classList.add('att');
function go(){w.classList.remove('go');void w.offsetWidth;setTimeout(function(){w.classList.remove('att');w.classList.add('go')},1000)}
if(document.readyState==='complete')go();else addEventListener('load',go);
try{new MutationObserver(function(){var on=/\\b(live|vis|hcur|cur)\\b/.test(sec.className);if(on&&!sec.__mpOn)go();sec.__mpOn=on}).observe(sec,{attributes:true,attributeFilter:['class']})}catch(e){}})()</script>"""
def emballer(svg):
    return '<div class="mpw" style="position:absolute;inset:0;z-index:50;background:#fff">'+svg.replace('width="816" height="1056" style="position:absolute;inset:0"','width="100%" height="100%" style="position:absolute;inset:0;display:block"')+JS+'</div>'
