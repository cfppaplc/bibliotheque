"""Convertit un livre au format « Recherche d'emploi » (hd.steps / main / ft.pn, ouvertures avec .img.hero) vers le format commun Métier+.
Usage : convertir_re.py <clair> <sortie> "<couleur programme>" "<couleur du livre>" """
import re,sys,base64
from bs4 import BeautifulSoup
src,dst,prog,acc=sys.argv[1:5]
s=open(src,encoding='utf-8').read()
F=lambda n:base64.b64encode(open('/tmp/cvr/%s.woff'%n,'rb').read()).decode()
fonts="".join("@font-face{font-family:%s;src:url(data:font/woff;base64,%s) format('woff')}"%(n,F(n)) for n in ['MPI5','MPI6','MPI8','MPD9'])
LG=base64.b64encode(open('/home/claude/bibliotheque/img/metier-plus.svg','rb').read()).decode()
P=[m.start() for m in re.finditer(r'<section class="page',s)]+[s.find('</body>')]
H=lambda x:BeautifulSoup(x,'html.parser')
def pied(ft):
    n=ft.select_one('.pn');sp=[x for x in ft.find_all('span') if x is not n]
    return H(f'<div class="mp-pied"><span>{sp[0].get_text(" ",strip=True) if sp else ""}</span><span class="n">{n.get_text(strip=True) if n else ""}</span><img src="data:image/svg+xml;base64,{LG}"></div>')
def styler(B):
    for t in B.find_all('h1'):
        if t.find_parent('svg'):continue
        t.name='h2';t.attrs={'class':['mp-h2']}
    for t in B.find_all('h2'):
        if 'mod' in (t.get('class') or []) or t.find_parent('svg') or 'mp-h2' in (t.get('class') or []):continue
        n=t.select_one('span.n')
        if n:n.name='i';n.attrs={}
        t.attrs={'class':['mp-h2']}
    for t in B.find_all('h3'):
        if not t.find_parent('svg'):t.attrs={'class':['mp-h3']}
    for t in B.select('div.box'):
        k=t.get('class') or []
        t['class']=['mp-enc','box']+(['mp-ret'] if 'retenir' in k else ['mp-sec'] if 'attention' in k else [])+[x for x in k if x not in('box','retenir','attention')]
        for l in t.find_all('span',class_='lab',recursive=False):l.name='b';l['class']=['t']
    for t in B.select('div.act'):t['class']=['mp-act']+t['class']
    for t in B.select('table'):
        if t.find_parent('svg') is None:t['class']=(t.get('class') or [])+['mp-tab']
def conv(h):
    so=H(h);sec=so.section
    hd=sec.select_one('div.hd');hero=sec.select_one('div.img.hero');mn=sec.select_one('div.main');ft=sec.select_one('div.ft')
    if not (hd or hero) or not mn: return h
    sec['class']=sec.get('class',[])+['mp','re'];sec['style']=sec.get('style','')+f';--mp-c:{acc};--mp-p:{prog}'
    if hero:
        pill=hero.find_next_sibling('div');pt=pill.get_text(' ',strip=True) if pill else ''
        parts=[x.strip() for x in pt.split('·')];mod=parts[0];dur=' · '.join(parts[1:])
        num=re.sub(r'\D','',mod) or mod[-1:]
        img=hero.find('img');ph=f'<img class="mp-photo" src="{img["src"]}">' if img else ''
        phd=hero.select_one('.ph');av=('<b>'+phd.b.get_text(strip=True)+'</b> · '+phd.b.next_sibling.strip() if phd and phd.b and phd.b.next_sibling else 'IMAGE DU MODULE À VENIR')
        h1=mn.find('h1');t1=h1.decode_contents() if h1 else ''
        if h1:h1.decompose()
        ld=mn.select_one('p.lead')
        if ld:ld['class']=['mp-intro']
        styler(mn);rest=mn.decode_contents()
        chap=sec.select_one('h2.mod');pd=pied(ft) if ft else ''
        sec.clear();sec['class']=sec['class']+['mp-ouv']
        sec.append(H(f'''{chap or ''}<i class="mpband"></i><div class="mp-bande">{ph}<span class="mp-avenir">{av}</span></div><div class="mp-mod">{mod.upper()}</div><div class="mp-num">{num}</div><div class="mp-dur">{dur.upper()}</div>
<div class="mp-bas"><h1>{t1}</h1>{rest}</div>{pd}'''))
        return str(so)
    st=hd.select_one('.steps');lab=hd.select_one('.lab')
    sp=lab.find_all('span') if lab else []
    seg=''
    if st:
        seg='<div class="mp-etapes">'+''.join('<i class="%s"></i>'%' '.join(i.get('class') or []) for i in st.find_all('i'))+'</div>'
    l0=sp[0].get_text(' ',strip=True) if sp else '';l1=sp[1].get_text(' ',strip=True) if len(sp)>1 else ''
    a,_,b=l0.partition('·')
    hd.replace_with(H(f'<i class="mpband"></i>{seg}<div class="mp-tete"><span><b>{a.strip()}</b>{" · "+b.strip() if b else ""}</span><span>{l1}</span></div>'))
    if ft:ft.replace_with(pied(ft))
    mn.attrs={'class':['body']};styler(mn)
    return str(so)
r=''.join([s[:P[0]]]+[conv(s[P[i]:P[i+1]]) for i in range(len(P)-1)]+[s[P[-1]:]])
css=open('/home/claude/bibliotheque/format/livre-mp.css').read()
r=r.replace('</head>','<style id="mp-format">'+fonts+css+'</style></head>',1)
open(dst,'w',encoding='utf-8').write(r);print('ok',len(re.findall(r'class="page[^"]* re\b',r)))
