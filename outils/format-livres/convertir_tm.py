"""Convertit un livre au format « Travaux mineurs » (hd / main / ft, onglets .tab .chip, ouvertures .open) vers le format commun Métier+.
Usage : convertir_tm.py <clair> <sortie> "<couleur programme>" """
import re,sys,base64
from bs4 import BeautifulSoup
src,dst,prog=sys.argv[1],sys.argv[2],sys.argv[3]
s=open(src,encoding='utf-8').read()
F=lambda n:base64.b64encode(open('/tmp/cvr/%s.woff'%n,'rb').read()).decode()
fonts="".join("@font-face{font-family:%s;src:url(data:font/woff;base64,%s) format('woff')}"%(n,F(n)) for n in ['MPI5','MPI6','MPI8','MPD9'])
LG=base64.b64encode(open('/home/claude/bibliotheque/img/metier-plus.svg','rb').read()).decode()
P=[m.start() for m in re.finditer(r'<section class="page',s)]+[s.find('</body>')]
H=lambda x:BeautifulSoup(x,'html.parser')
def barre(tab):
    I=tab.select('.chip');c=next((k for k,x in enumerate(I) if 'off' not in (x.get('class') or [])),-1)
    return '<div class="mp-etapes">'+''.join('<i class="%s"></i>'%('cur' if k==c else 'on' if k<c else '') for k in range(len(I)))+'</div>'
def pied(ft):
    n=ft.select_one('.n');sp=[x for x in ft.find_all('span') if x is not n]
    g=sp[0].get_text(' ',strip=True) if sp else ''
    return H(f'<div class="mp-pied"><span>{g}</span><span class="n">{n.get_text(strip=True) if n else ""}</span><img src="data:image/svg+xml;base64,{LG}"></div>')
def boite(t):
    k=t.get('class') or []
    t['class']=['mp-enc']+(['mp-ret'] if 'retenir' in k else ['mp-sec'] if 'danger' in k else ['mp-sit'] if 'chantier' in k else [])
    for b in t.find_all('div',class_='bt',recursive=False):b['class']=['t']
def conv(h):
    so=H(h);sec=so.section
    op=sec.select_one('div.open');hd=sec.select_one('div.hd')
    if not op and not hd: return h
    m=re.search(r'--c:\s*(#[0-9a-fA-F]+)',sec.get('style',''));acc=m.group(1) if m else '#24282c'
    sec['class']=sec.get('class',[])+['mp','tm'];sec['style']=sec.get('style','')+f';--mp-c:{acc};--mp-p:{prog}'
    if op:
        meta=op.select_one('.meta').get_text(' ',strip=True);big=op.select_one('.big').get_text(strip=True);ttl=op.select_one('.ttl').decode_contents()
        parts=[x.strip() for x in meta.split('·')];mod=parts[0];dur=' · '.join(parts[1:])
        bx=op.select('div.box');obj=bx[0] if bx else None
        lab=obj.select_one('.bt').get_text(strip=True) if obj else ''
        lis=''.join('<li>'+li.decode_contents()+'</li>' for li in obj.select('li')) if obj else ''
        aut=''
        for b in bx[1:]:
            boite(b);b['class']=b['class']+['mp-mat'];aut+=str(b)
        svg=[x for x in op.find_all('svg') if not x.find_parent('svg')];svg=svg[-1] if svg else None
        chap=sec.select_one('h2.chap');ft=sec.select_one('div.ft');pd=pied(ft) if ft else ''
        sec.clear();sec['class']=sec['class']+['mp-ouv']
        sec.append(H(f'''{chap or ''}<i class="mpband"></i><div class="mp-bande">{svg or ''}<span class="mp-avenir">IMAGE DU MODULE À VENIR</span></div><div class="mp-mod">{mod.upper()}</div><div class="mp-num">{big}</div><div class="mp-dur">{dur.upper()}</div>
<div class="mp-bas"><h1>{ttl}</h1><div class="mp-h3">{lab}</div><ul class="mp-obj">{lis}</ul>{aut}</div>{pd}'''))
        return str(so)
    tab=sec.select_one('div.tab');seg=barre(tab) if tab else ''
    if tab:tab.decompose()
    hd.attrs={'class':['mp-tete']};hd.insert_before(H('<i class="mpband"></i>'+seg))
    ft=sec.select_one('div.ft')
    if ft:ft.replace_with(pied(ft))
    mn=sec.select_one('div.main')
    if mn:mn.attrs={'class':['body']}
    B=mn or sec
    for t in B.find_all('h2'):
        if 'chap' in (t.get('class') or []) or t.find_parent('svg'):continue
        n=t.select_one('.sn')
        if n:n.name='i';n.attrs={}
        t.attrs={'class':['mp-h2']}
    for t in B.find_all('h3'):
        if not t.find_parent('svg'):t.attrs={'class':['mp-h3']}
    for t in B.select('div.box'):boite(t)
    for t in B.select('div.act'):
        t['class']=['mp-act'];ah=t.select_one('div.ah')
        if ah:
            tg=ah.select_one('.tag');tt=ah.select_one('.t')
            ah.replace_with(H(f'<span class="mp-act-t">{tg.decode_contents() if tg else ""}<i>{tt.decode_contents() if tt else ""}</i></span>'))
    for t in B.select('table'):
        if t.find_parent('svg') is None:t['class']=(t.get('class') or [])+['mp-tab']
    for t in B.select('.cap'):
        if t.get('class')==['cap']:t['class']=['mp-cap']
    return str(so)
r=''.join([s[:P[0]]]+[conv(s[P[i]:P[i+1]]) for i in range(len(P)-1)]+[s[P[-1]:]])
css=open('/home/claude/bibliotheque/format/livre-mp.css').read()
r=r.replace('</head>','<style id="mp-format">'+fonts+css+'</style></head>',1)
open(dst,'w',encoding='utf-8').write(r);print('ok',len(re.findall(r'class="page[^"]* tm',r)))
