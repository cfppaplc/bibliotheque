"""Convertit un livre au format « Micro-ordinateur » (hd .cap .lab .ttl / rule / main / ft, ouvertures section.page.div) vers le format commun Métier+.
Usage : convertir_mo.py <clair> <sortie> "<couleur programme>" "<couleur du livre>" """
import re,sys,base64
from bs4 import BeautifulSoup
src,dst,prog,acc=sys.argv[1:5]
s=open(src,encoding='utf-8').read()
F=lambda n:base64.b64encode(open('/tmp/cvr/%s.woff'%n,'rb').read()).decode()
fonts="".join("@font-face{font-family:%s;src:url(data:font/woff;base64,%s) format('woff')}"%(n,F(n)) for n in ['MPI5','MPI6','MPI8','MPD9'])
LG=base64.b64encode(open('/home/claude/bibliotheque/img/metier-plus.svg','rb').read()).decode()
P=[m.start() for m in re.finditer(r'<section class="page',s)]+[s.find('</body>')]
H=lambda x:BeautifulSoup(x,'html.parser')
NM=max(int(x) for x in re.findall(r'<div class="cap">(\d+)</div>',s))
def pied(ft):
    n=ft.find('b');sp=ft.find('span')
    return H(f'<div class="mp-pied"><span>{sp.get_text(" ",strip=True) if sp else ""}</span><span class="n">{n.get_text(strip=True) if n else ""}</span><img src="data:image/svg+xml;base64,{LG}"></div>')
def conv(h):
    so=H(h);sec=so.section;cl=sec.get('class') or []
    hd=sec.select_one('div.hd');ouv='div' in cl and sec.select_one('div.num')
    if not hd and not ouv: return h
    sec['class']=cl+['mp','mo'];sec['style']=sec.get('style','')+f';--mp-c:{acc};--mp-p:{prog}'
    if ouv:
        num=sec.select_one('div.num').get_text(strip=True)
        mods=[d for d in sec.find_all('div',recursive=False) if d.get('style','').find('letter-spacing:.3em')>=0]
        mod=mods[0].get_text(strip=True) if mods else 'MODULE '+num
        lst=sec.find('ul');lab=lst.find_previous_sibling('div') if lst else None
        lis=''.join('<li>'+li.decode_contents()+'</li>' for li in lst.find_all('li')) if lst else ''
        blocs=[d for d in sec.find_all('div',recursive=False) if 'top:5.05in' in d.get('style','')]
        ttl=intro=''
        if blocs:
            ds=blocs[0].find_all('div',recursive=False);ttl=ds[0].decode_contents() if ds else '';intro=ds[-1].decode_contents() if len(ds)>2 else ''
        touches=[d for d in sec.find_all('div',recursive=False) if 'bottom:1.05in' in d.get('style','')]
        tch=''.join(str(x) for x in touches[0].find_all('span')) if touches else ''
        hs=''.join(str(x) for x in sec.select('h2.mod,h2.sr'))
        pd=[d for d in sec.find_all('div',recursive=False) if 'bottom:.4in' in d.get('style','')]
        sps=pd[0].find_all('span',recursive=False) if pd else []
        d0=sps[0] if sps else None;di=d0.find('span') if d0 else None
        dur=di.get_text(strip=True) if di else ''
        if di:di.decompose()
        pp=[d0.get_text(' ',strip=True) if d0 else '',sps[1].get_text(strip=True) if len(sps)>1 else '']
        pied_=f'<div class="mp-pied"><span>{pp[0] if pp else ""}</span><span class="n">{pp[-1] if pp else ""}</span><img src="data:image/svg+xml;base64,{LG}"></div>'
        sec.clear();sec['class']=[c for c in sec['class'] if c!='div']+['mp-ouv']
        sec.append(H(f'''{hs}<i class="mpband"></i><div class="mp-bande"><div class="mp-touches">{tch}</div><span class="mp-avenir">IMAGE DU MODULE À VENIR</span></div><div class="mp-mod">{mod.upper()}</div><div class="mp-num">{num}</div><div class="mp-dur">{dur.upper()}</div>
<div class="mp-bas"><h1>{ttl}</h1><div class="mp-intro">{intro}</div><div class="mp-h3">{lab.get_text(strip=True) if lab else ''}</div><ul class="mp-obj">{lis}</ul></div>{pied_}'''))
        return str(so)
    cp=hd.select_one('.cap');lb=hd.select_one('.lab');tt=hd.select_one('.ttl')
    k=int(cp.get_text(strip=True)) if cp and cp.get_text(strip=True).isdigit() else 0
    seg='<div class="mp-etapes">'+''.join('<i class="%s"></i>'%('cur' if i==k else 'on' if i<k else '') for i in range(1,NM+1))+'</div>'
    mn=sec.select_one('div.main')
    h3=mn.find('h3') if mn else None
    hd.replace_with(H(f'<i class="mpband"></i>{seg}<div class="mp-tete"><span><b>{lb.get_text(strip=True) if lb else ""}</b> · {tt.get_text(strip=True) if tt else ""}</span><span></span></div>'))
    r=sec.select_one('div.rule')
    if r:r.decompose()
    ft=sec.select_one('div.ft')
    if ft:ft.replace_with(pied(ft))
    if mn:
        mn.attrs={'class':['body']}
        for i,t in enumerate(mn.find_all('h3')):
            if t.find_parent('svg'):continue
            t.attrs={'class':['mp-h2' if i==0 else 'mp-h3']}
        for t in mn.select('div.box'):
            k2=t.get('class');t['class']=['mp-enc']+(['mp-sit'] if 'sl' in k2 else [])+[x for x in k2 if x not in('box','sl')]
        for t in mn.select('div.act'):
            t['class']=['mp-act'];tt=t.find('div',class_='t',recursive=False)
            if tt:
                sp=tt.find('span');st=sp.decode_contents() if sp else ''
                if sp:sp.decompose()
                tt.replace_with(H(f'<span class="mp-act-t">{tt.decode_contents().strip().rstrip("·").strip()}{"<i>"+st+"</i>" if st else ""}</span>'))
            b=t.find('div',class_='b',recursive=False)
            if b:b['class']=['mp-ab']
        for t in mn.select('table'):
            if t.find_parent('svg') is None:t['class']=(t.get('class') or [])+['mp-tab']
    return str(so)
r=''.join([s[:P[0]]]+[conv(s[P[i]:P[i+1]]) for i in range(len(P)-1)]+[s[P[-1]:]])
css=open('/home/claude/bibliotheque/format/livre-mp.css').read()
r=r.replace('</head>','<style id="mp-format">'+fonts+css+'</style></head>',1)
open(dst,'w',encoding='utf-8').write(r);print('ok',len(re.findall(r'class="page[^"]* mo\b',r)))
