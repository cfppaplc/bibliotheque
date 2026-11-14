"""Convertit « Montages électriques » (C5, fiches d'atelier .hd/.meta/.box/.pre/.sig) vers le format commun Métier+.
Usage : convertir_c5.py <clair> <sortie> "<couleur programme>" """
import re,sys,base64
from bs4 import BeautifulSoup
src,dst,prog=sys.argv[1],sys.argv[2],sys.argv[3]
s=open(src,encoding='utf-8').read()
F=lambda n:base64.b64encode(open('/tmp/cvr/%s.woff'%n,'rb').read()).decode()
fonts="".join("@font-face{font-family:%s;src:url(data:font/woff;base64,%s) format('woff')}"%(n,F(n)) for n in ['MPI5','MPI6','MPI8','MPD9'])
LG=base64.b64encode(open('/home/claude/bibliotheque/img/metier-plus.svg','rb').read()).decode()
P=[m.start() for m in re.finditer(r'<section class="page',s)]+[s.rfind('</body>')]
H=lambda x:BeautifulSoup(x,'html.parser')
MODS=[];cur=[]
for i in range(len(P)-1):
    m=re.search(r'<h2 class="mod"[^>]*>(.*?)</h2>',s[P[i]:P[i+1]])
    if m:MODS.append(m.group(1))
    cur.append(len(MODS)-1)
NM=len(MODS)
def conv(i,h):
    so=H(h);sec=so.section;hd=sec.find('div',class_='hd',recursive=False)
    if not hd:return h
    sec['class']=sec.get('class',[])+['mp','c5'];sec['style']=sec.get('style','')+f';--mp-c:#C0392B;--mp-p:{prog}'
    c=cur[i];mod=MODS[c] if c>=0 else ''
    a,_,b=mod.partition('—')
    bar='<div class="mp-etapes">'+''.join('<i class="%s"></i>'%('cur' if k==c else 'on' if k<c else '') for k in range(NM))+'</div>'
    meta=hd.find('div',class_='meta');h3=hd.find('h3')
    h3.name='h2';h3['class']=['mp-h2'];n=h3.find('span',class_='num')
    if n:n.name='i';n.attrs={}
    if meta:meta['class']=['mp-meta']
    hd.unwrap()
    body=so.new_tag('div');body['class']=['body']
    for x in list(sec.contents):
        if getattr(x,'name',None)=='h2' and 'mod' in (x.get('class') or []):continue
        body.append(x.extract())
    sec.append(H('<i class="mpband"></i>'+bar+'<div class="mp-tete"><span><b>'+a.strip()+'</b>'+(' · '+b.strip() if b.strip() else '')+'</span><span></span></div>'))
    sec.append(body)
    sec.append(H(f'<div class="mp-pied"><span>Montages électriques · Plomberie et chauffage</span><span class="n">{i+1}</span><img src="data:image/svg+xml;base64,{LG}"></div>'))
    for d in body.select('div.box'):
        d['class']=['mp-enc','mp-sec' if 'warn' in d['class'] else 'mp-cm']+d['class']
    for d in body.select('div.pre'):
        d['class']=['mp-enc','mp-sit']+d['class']
    for t in body.select('table'):
        if 'leg' not in (t.get('class') or []):t['class']=(t.get('class') or [])+['mp-tab']
    for t in body.find_all('h4'):t['class']=(t.get('class') or [])+['mp-h3']
    return str(so)
r=''.join([s[:P[0]]]+[conv(i,s[P[i]:P[i+1]]) for i in range(len(P)-1)]+[s[P[-1]:]])
css=open('/home/claude/bibliotheque/format/livre-mp.css').read()
r=r.replace('</head>','<style id="mp-format">'+fonts+css+'</style></head>',1)
open(dst,'w',encoding='utf-8').write(r);print('ok',len(re.findall(r'class="page[^"]* c5\b',r)),NM)
