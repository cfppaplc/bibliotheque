"""Convertit « Protection incendie » (.tete, .onglets, .contenu>.fit, .pied, ouvertures .ouv) vers le format commun Métier+.
Usage : convertir_pi.py <clair> <sortie> "<couleur programme>" """
import re,sys,base64
from bs4 import BeautifulSoup
src,dst,prog=sys.argv[1],sys.argv[2],sys.argv[3]
s=re.sub(r'<section (data-pas="\d+") class="page"',r'<section class="page" \1',open(src,encoding='utf-8').read())
F=lambda n:base64.b64encode(open('/tmp/cvr/%s.woff'%n,'rb').read()).decode()
fonts="".join("@font-face{font-family:%s;src:url(data:font/woff;base64,%s) format('woff')}"%(n,F(n)) for n in ['MPI5','MPI6','MPI8','MPD9'])
LG=base64.b64encode(open('/home/claude/bibliotheque/img/metier-plus.svg','rb').read()).decode()
P=[m.start() for m in re.finditer(r'<section class="page',s)]+[s.rfind('</body>')]
H=lambda x:BeautifulSoup(x,'html.parser')
PIED="Protection incendie d'un bâtiment · 436-312"
def barre(tab):
    I=tab.find_all('span',recursive=False);c=next((k for k,x in enumerate(I) if 'on' in (x.get('class') or [])),-1)
    return '<div class="mp-etapes">'+''.join('<i class="%s"></i>'%('cur' if k==c else 'on' if k<c else '') for k in range(len(I)))+'</div>'
def pied(ft):
    b=ft.find('b');sp=ft.find('span');t=sp.get_text(' ',strip=True) if sp else PIED
    return f'<div class="mp-pied"><span>{t}</span><span class="n">{b.get_text(strip=True) if b else ""}</span><img src="data:image/svg+xml;base64,{LG}"></div>'
BOX={'retenir':'mp-ret','terrain':'mp-sit','att':'mp-sec','def':'mp-cm'}
def conv(h):
    so=H(h);sec=so.section
    ct=sec.select_one('div.contenu');ouv='ouv' in sec.get('class',[])
    if not ct and not ouv: return h
    m=re.search(r'--m:\s*(#[0-9a-fA-F]+)',sec.get('style',''));ACC=m.group(1) if m else '#E8590C'
    sec['class']=sec.get('class',[])+['mp','pi'];sec['style']=sec.get('style','')+f';--mp-c:{ACC};--mp-p:{prog}'
    tab=sec.select_one('div.onglets');seg=barre(tab) if tab else ''
    ft=sec.select_one('div.pied');pd=pied(ft) if ft else ''
    if ouv:
        modh=sec.select_one('h2.mod');mod=sec.select_one('.pill').get_text(strip=True);num=re.sub(r'\D','',mod) or sec.select_one('.grosnum').get_text(strip=True)
        ttl=sec.select_one('.titre').decode_contents();dur=sec.select_one('.duree').get_text(strip=True).replace('⏱','').strip()
        cartes=sec.select('div.carte');c1,c2=cartes[0],cartes[1]
        img=c2.find('img');ph=f'<img class="mp-photo" src="{img["src"]}">' if img else ''
        if img:img.decompose()
        def col(d):
            for t in d.select('.tt'):t.name='div';t.attrs={'class':['mp-h3']}
            for u in d.select('ul.obj'):u['class']=['mp-obj']
            for u in d.select('ul.lst'):u['class']=['lst','mp-cont']
            return d.decode_contents()
        ds=c1.find_all('div',recursive=False)
        cols=''.join('<div>%s</div>'%col(d) for d in ds) if len(ds)>1 and not c1.find('div',class_='tt',recursive=False) else '<div>%s</div>'%col(c1)
        mid=''
        for x in sec.select('div.fait,div.att'):
            if x.find_parent('div',class_='carte'):continue
            del x['style']
            if 'att' in x['class']:x['class']=['mp-enc','mp-sec']+x['class'];tt=x.select_one('.tt');tt['class']=['t']
            mid+=str(x)
        c2t=c2.find('div');tt=c2t.select_one('.tt');tt['class']=['t'];c2t.attrs={'class':['mp-enc','mp-cm']}
        sec.clear();sec['class']=sec['class']+['mp-ouv']
        sec.append(H(f'''{modh or ''}<i class="mpband"></i><div class="mp-bande">{ph}<span class="mp-avenir">IMAGE DU MODULE À VENIR</span></div><div class="mp-mod">{mod.upper()}</div><div class="mp-num{" long" if len(num)>2 else ""}">{num}</div><div class="mp-dur">{dur.upper()}</div>
<div class="mp-bas"><h1>{ttl}</h1><div class="mp-duo{' un' if cols.count('<div>')==1 else ''}">{cols}</div>{mid}{c2t}</div>{pd}'''))
        return str(so)
    te=sec.select_one('div.tete');ml=te.select_one('.mod').get_text(' ',strip=True) if te else ''
    a,_,b=ml.partition('·')
    for x in [te,tab,ft]:
        if x:x.decompose()
    ct.insert_before(H('<i class="mpband"></i>'+seg+'<div class="mp-tete"><span><b>'+a.strip()+'</b>'+(' · '+b.strip() if b.strip() else '')+'</span><span></span></div>'))
    ct.insert_after(H(pd))
    ct.attrs={'class':['body']}
    for f in ct.select('div.fit'):
        if f.get('style'):del f['style']
    for t in ct.find_all('h2'):
        n=t.find('span',class_='num')
        if n:n.name='i';n.attrs={}
        t['class']=['mp-h2']
    for t in ct.find_all('h3'):
        if not t.find_parent('svg'):t['class']=(t.get('class') or [])+['mp-h3']
    for k,v in BOX.items():
        for t in ct.select('div.'+k):
            t['class']=['mp-enc',v]+t['class']
            c=t.find('div',class_='tt')
            if c:c['class']=['t']
    for t in ct.select('table'):
        if t.find_parent('svg') is None:t['class']=(t.get('class') or [])+['mp-tab']
    return str(so)
r=''.join([s[:P[0]]]+[conv(s[P[i]:P[i+1]]) for i in range(len(P)-1)]+[s[P[-1]:]])
css=open('/home/claude/bibliotheque/format/livre-mp.css').read()
r=r.replace('</head>','<style id="mp-format">'+fonts+css+'</style></head>',1)
open(dst,'w',encoding='utf-8').write(r);print('ok',len(re.findall(r'class="page[^"]* pi\b',r)))
