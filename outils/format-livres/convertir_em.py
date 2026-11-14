"""Convertit « Entretien ménager » (format C9 : .bar, .tabs, .main, .foot, ouvertures data-open) vers le format commun Métier+.
Usage : convertir_em.py <clair> <sortie> "<couleur programme>" """
import re,sys,base64
from bs4 import BeautifulSoup
src,dst,prog=sys.argv[1],sys.argv[2],sys.argv[3]
s=open(src,encoding='utf-8').read()
F=lambda n:base64.b64encode(open('/tmp/cvr/%s.woff'%n,'rb').read()).decode()
fonts="".join("@font-face{font-family:%s;src:url(data:font/woff;base64,%s) format('woff')}"%(n,F(n)) for n in ['MPI5','MPI6','MPI8','MPD9'])
LG=base64.b64encode(open('/home/claude/bibliotheque/img/metier-plus.svg','rb').read()).decode()
P=[m.start() for m in re.finditer(r'<section class="page',s)]+[s.rfind('</body>')]
H=lambda x:BeautifulSoup(x,'html.parser')
def barre(tab):
    I=tab.find_all('span',recursive=False);c=next((k for k,x in enumerate(I) if 'on' in (x.get('class') or [])),-1)
    return '<div class="mp-etapes">'+''.join('<i class="%s"></i>'%('cur' if k==c else 'on' if k<c else '') for k in range(len(I)))+'</div>'
def pied(ft):
    sp=ft.find('span');b=ft.find('b')
    return H(f'<div class="mp-pied"><span>{sp.get_text(" ",strip=True) if sp else ""}</span><span class="n">{b.get_text(strip=True) if b else ""}</span><img src="data:image/svg+xml;base64,{LG}"></div>')
DER={}
BOX={'ret':['mp-ret'],'ter':['mp-sit'],'sav':['mp-sav'],'urg':['mp-sec'],'cm':['mp-cm']}
def conv(h):
    so=H(h);sec=so.section
    mn=sec.select_one('div.main');op=sec.get('data-open')
    if not mn and not op: return h
    m=re.search(r'--m:\s*(#[0-9a-fA-F]+)',sec.get('style',''));acc=m.group(1) if m else '#14191e'
    sec['class']=sec.get('class',[])+['mp','em'];sec['style']=sec.get('style','')+f';--mp-c:{acc};--mp-p:{prog}'
    tab=sec.select_one('div.tabs');seg=barre(tab) if tab else ''
    on=tab.select_one('span.on') if tab else None;ml=on.get_text(strip=True) if on else ''
    ml='Module final' if ml=='F' else ('Module '+ml if ml else '')
    ft=sec.select_one('div.foot');pd=str(pied(ft)) if ft else ''
    if op:
        code=sec.select_one('div.code');ct=code.get_text(' ',strip=True) if code else ''
        parts=[x.strip() for x in ct.split('·')];mod=parts[0];dur=' · '.join(parts[1:])
        num=re.sub(r'^Module\s*','',mod)
        img=sec.select_one('.opimg img');ph=f'<img class="mp-photo" src="{img["src"]}">' if img else ''
        disp=sec.select_one('div.disp');ttl=disp.decode_contents() if disp else ''
        intro=disp.find_next('p') if disp else None;it=intro.decode_contents() if intro else ''
        tags=''.join('<span>%s</span>'%t.get_text(strip=True) for t in sec.select('span.tag'))
        modh=sec.select_one('h2.modh')
        sec.clear();sec['class']=sec['class']+['mp-ouv']
        sec.append(H(f'''{modh or ''}<i class="mpband"></i><div class="mp-bande">{ph}<span class="mp-avenir">IMAGE DU MODULE À VENIR</span></div><div class="mp-mod">{mod.upper()}</div><div class="mp-num">{num}</div><div class="mp-dur">{dur.upper()}</div>
<div class="mp-bas"><h1>{ttl}</h1><div class="mp-intro">{it}</div>{'<div class="mp-h3">Mots clés du module</div><div class="mp-mots">'+tags+'</div>' if tags else ''}</div>{pd}'''))
        return str(so)
    if tab:tab.decompose()
    for b in sec.select('div.bar'):b.decompose()
    if ft:ft.replace_with(H(pd))
    # en-tête de page : module et titre de la section
    mh=sec.select_one('h2.modh')
    kick=mn.select_one('div.code.kick')
    global DER
    titre=kick.get_text(' ',strip=True) if kick else DER.get(ml,'')
    DER[ml]=titre
    mn.insert_before(H('<i class="mpband"></i>'+seg+'<div class="mp-tete"><span><b>'+ml+'</b>'+(' · ' if titre else '')+re.sub(r'^[0-9F.]+\s*·\s*','',titre)+'</span><span></span></div>'))
    mn.attrs={'class':['body']}
    for k in mn.select('div.code.kick'):
        t=k.get_text(' ',strip=True);a,_,b=t.partition('·')
        h1=k.find_next_sibling('h1')
        if h1 and 'sec' in (h1.get('class') or []):
            h1.name='h2';h1.attrs={'class':['mp-h2']};h1.insert(0,H('<i>%s</i>'%a.strip()))
            if b.strip():k.replace_with(H('<p class="mp-kick">%s</p>'%b.strip()))
            else:k.decompose()
    for t in mn.find_all('h1'):
        if 'sec' in (t.get('class') or []):t.name='h2';t.attrs={'class':['mp-h2']}
    for t in mn.find_all('h3'):
        if not t.find_parent('svg'):t['class']=(t.get('class') or [])+['mp-h3']
    for k,v in BOX.items():
        for t in mn.select('div.'+k):
            t['class']=['mp-enc']+v+[x for x in t['class'] if x!=k]
            c=t.find('div',class_='code',recursive=False)
            if c:c['class']=['t']
    for t in mn.select('div.at'):
        t['class']=['mp-act']+[x for x in t['class'] if x!='at']
        c=t.find('div',class_='code',recursive=False)
        if c:
            a,_,b=c.get_text(' ',strip=True).partition('·')
            c.replace_with(H('<span class="mp-act-t">%s%s</span>'%(a.strip(),'<i>%s</i>'%b.strip() if b.strip() else '')))
    for t in mn.select('table'):
        if t.find_parent('svg') is None:t['class']=(t.get('class') or [])+['mp-tab']
    return str(so)
r=''.join([s[:P[0]]]+[conv(s[P[i]:P[i+1]]) for i in range(len(P)-1)]+[s[P[-1]:]])
css=open('/home/claude/bibliotheque/format/livre-mp.css').read()
r=r.replace('</head>','<style id="mp-format">'+fonts+css+'</style></head>',1)
open(dst,'w',encoding='utf-8').write(r);print('ok',len(re.findall(r'class="page[^"]* em\b',r)))
