"""Convertit un livre au format « Maquette 3D » (lecture de plans EGI, C6) vers le format commun Métier+.
Usage : convertir_m3d.py <clair> <sortie> "<couleur programme>" """
import re,sys,base64
from bs4 import BeautifulSoup
src,dst,prog=sys.argv[1],sys.argv[2],sys.argv[3]
D='/home/claude/bibliotheque/outils/format-livres/'
s=open(src,encoding='utf-8').read()
F=lambda n:base64.b64encode(open('/tmp/cvr/%s.woff'%n,'rb').read()).decode()
fonts="".join("@font-face{font-family:%s;src:url(data:font/woff;base64,%s) format('woff')}"%(n,F(n)) for n in ['MPI5','MPI6','MPI8','MPD9'])
LG=base64.b64encode(open('/home/claude/bibliotheque/img/metier-plus.svg','rb').read()).decode()
P=[m.start() for m in re.finditer(r'<section class="page',s)]+[s.find('</body>')]
H=lambda x:BeautifulSoup(x,'html.parser')
def pied(ft):
    d=ft.find_all('div',recursive=False);b=ft.find('b')
    g=d[0].get_text(' ',strip=True) if d else '';fe=d[1].get_text(' ',strip=True) if len(d)>2 else ''
    lb=d[-1].find(string=True,recursive=False) if d else None;lb=lb.strip() if lb else ''
    if lb and lb.upper()!='PAGE': fe=(fe+' · ' if fe else '')+lb
    return H(f'<div class="mp-pied"><span>{g}</span><span class="n">{b.get_text(strip=True) if b else ""}</span><span class="mp-fe">{fe}<img src="data:image/svg+xml;base64,{LG}"></span></div>')
def conv(h):
    so=H(h);sec=so.section;hd=sec.select_one('div.hd')
    if not hd: return h
    m=re.search(r'--m:\s*(#[0-9a-fA-F]+)',sec.get('style',''));acc=m.group(1) if m else '#16222c'
    sec['class']=sec.get('class',[])+['mp'];sec['style']=sec.get('style','')+f';--mp-c:{acc};--mp-p:{prog}'
    tab=hd.select_one('.tab');tt=hd.select_one('.t');rr=hd.select_one('.r')
    tab=tab.get_text(strip=True) if tab else '';tt=tt.get_text(strip=True) if tt else '';rr=rr.get_text(strip=True) if rr else ''
    side=sec.select_one('div.side');ft=sec.select_one('div.ft');fw=sec.select_one('div.fitwrap')
    seg=''
    if side:
        I=side.find_all('i');c=next((k for k,x in enumerate(I) if 'on' in (x.get('class') or [])),-1)
        seg='<div class="mp-etapes">'+''.join('<i class="%s"></i>'%('cur' if k==c else 'on' if k<c else '') for k in range(len(I)))+'</div>'
        side.decompose()
    if rr=='Ouverture' and fw:
        sm=fw.find('h1').find('small');smt=sm.get_text(strip=True);sm.decompose()
        titre=fw.find('h1').decode_contents().strip()
        num=re.sub(r'\D','',tab) or tab[-1:]
        dur=smt.split('·')[-1].strip() if '·' in smt else ''
        svg=fw.find('svg');cap=fw.select_one('div.cap');bg=fw.select_one('.badge3')
        bg=f'<span class="mp-badge">{bg.get_text(strip=True)}</span>' if bg else ''
        bx=fw.select('div.box');obj=bx[0] if bx else None
        lab=obj.find('b',class_='k').get_text(strip=True) if obj else ''
        lis=''.join('<li>'+li.decode_contents()+'</li>' for li in obj.select('li')) if obj else ''
        aut=''
        for b in bx[1:]:
            for k in b.find_all('b',class_='k'):k['class']=['t'];k.attrs.pop('style',None)
            aut+='<div class="mp-enc mp-sav mp-mat">'+b.decode_contents()+'</div>'
        mod=sec.select_one('h2.mod')
        pd=pied(ft) if ft else ''
        sec.clear()
        sec['class']=sec['class']+['mp-ouv']
        sec.append(H(f'''{mod or ''}<i class="mpband"></i><div class="mp-bande">{svg or ''}{bg}<span class="mp-avenir">IMAGE DU MODULE À VENIR</span></div><div class="mp-mod">{tab.upper()} · {tt.upper()}</div><div class="mp-num">{num}</div><div class="mp-dur">{dur.upper()}</div>
<div class="mp-bas"><h1>{titre}</h1><div class="mp-intro">{cap.decode_contents() if cap else ''}</div>
<div class="mp-h3">{lab}</div><ul class="mp-obj">{lis}</ul>{aut}</div>{pd}'''))
        return str(so)
    hd.replace_with(H(f'<i class="mpband"></i>{seg}<div class="mp-tete"><span><b>{tab}</b> · {tt}</span><span>{rr}</span></div>'))
    if ft: ft.replace_with(pied(ft))
    if fw: fw.attrs={'class':['body']}
    B=sec.select_one('div.body') or sec
    for t in B.find_all('h1'):
        sm=t.find('small')
        if sm: sm.name='i';sm.attrs={}
        t.name='h2';t.attrs={'class':['mp-h2']}
    for t in B.find_all(['h2','h3']):
        if 'mp-h2' in (t.get('class') or []) or t.find_parent('svg'):continue
        t.name='h3';t.attrs={'class':['mp-h3']}
    for t in B.select('div.box'):
        k=['mp-enc']+(['mp-sav'] if 'g' in t['class'] else [])
        t['class']=k
        for l in t.find_all('b',class_='k',recursive=False):l['class']=['t']
    for t in B.select('div.keep3'):
        t['class']=['mp-enc','mp-ret']
        for l in t.find_all('b',class_='k',recursive=False):l['class']=['t']
    for t in B.select('div.act'):
        t['class']=['mp-act'];ah=t.select_one('div.ah')
        if ah:
            i=ah.find('i');it=i.get_text(strip=True) if i else ''
            if i:i.decompose()
            ah.replace_with(H(f'<span class="mp-act-t">{it}<i>{ah.decode_contents().strip()}</i></span>'))
        ab=t.select_one('div.ab')
        if ab:ab['class']=['mp-ab']
    for t in B.select('table'):
        if t.find_parent('svg') is None:t['class']=(t.get('class') or [])+['mp-tab']
    for t in B.select('div.cap'):
        if t['class']==['cap'] and t.find_parent(class_=['dstage','dcap']) is None:t['class']=['mp-cap']
    return str(so)
out=[s[:P[0]]]+[conv(s[P[i]:P[i+1]]) for i in range(len(P)-1)]+[s[P[-1]:]]
r=''.join(out)
css=open(D+'livre-mp.css').read()+open(D+'livre-mp-m3d.css').read()
r=r.replace('</head>','<style id="mp-format">'+fonts+css+'</style></head>',1)
open(dst,'w',encoding='utf-8').write(r);print('ok',r.count('class="page') ,r.count(' mp"')+r.count(' mp '))
