"""Convertit « Entretien de matériel électrique » (C13 EGI : .hd, .ft, ouvertures sombres h2.modh) vers le format commun Métier+.
Usage : convertir_me.py <clair> <sortie> "<couleur programme>" """
import re,sys,base64
from bs4 import BeautifulSoup
src,dst,prog=sys.argv[1],sys.argv[2],sys.argv[3]
s=open(src,encoding='utf-8').read()
F=lambda n:base64.b64encode(open('/tmp/cvr/%s.woff'%n,'rb').read()).decode()
fonts="".join("@font-face{font-family:%s;src:url(data:font/woff;base64,%s) format('woff')}"%(n,F(n)) for n in ['MPI5','MPI6','MPI8','MPD9'])
LG=base64.b64encode(open('/home/claude/bibliotheque/img/metier-plus.svg','rb').read()).decode()
P=[m.start() for m in re.finditer(r'<section class="page',s)]+[s.rfind('</body>')]
H=lambda x:BeautifulSoup(x,'html.parser')
CH=[i for i in range(len(P)-1) if 'class="mod modh"' in s[P[i]:P[i+1]]];NM=len(CH)
def barre(i):
    c=sum(1 for x in CH if x<=i)-1
    return '<div class="mp-etapes">'+''.join('<i class="%s"></i>'%('cur' if k==c else 'on' if k<c else '') for k in range(NM))+'</div>'
def conv(i,h):
    so=H(h);sec=so.section;ouv=i in CH
    hd=sec.find('div',class_='hd',recursive=False)
    if not hd and not ouv:return h
    m=re.search(r'--ad:\s*(#[0-9a-fA-F]+)',sec.get('style',''));acc=m.group(1) if m else '#4F6400'
    sec['class']=sec.get('class',[])+['mp','me'];sec['style']=re.sub(r'background:[^;]*;|color:[^;]*;|padding:[^;]*;','',sec.get('style',''))+f';--mp-c:{acc};--mp-p:{prog}'
    if ouv:
        modh=sec.find('h2');ds=sec.find_all('div',class_='disp')
        top=sec.find('div',recursive=False,style=re.compile('justify-content:space-between')) 
        sp=top.find_all('span') if top else []
        num=ds[0].get_text(strip=True).lstrip('0') or ds[0].get_text(strip=True);ttl=ds[1].decode_contents()
        intro=ds[1].find_next_sibling('p');it=intro.decode_contents() if intro else ''
        svg=''.join(str(x) for x in sec.find_all('svg',recursive=False))
        for x in sec.find_all('img'):
            if 'mp-ouv' not in (x.get('class') or []):x.attrs={'class':['mp-ill'],'src':x['src']};svg+=str(x)
        g=sec.find('div',recursive=False,style=re.compile('grid-template-columns'))
        cols=''
        if g:
            for c in g.find_all('div',recursive=False):
                d=c.find_all('div',recursive=False)
                t=d[0].get_text(strip=True) if d else ''
                lis=''.join('<li>%s</li>'%x.strip().lstrip('→').strip() for x in d[1].decode_contents().split('<br/>') if x.strip()) if len(d)>1 else ''
                cols+='<div>%s<ul class="mp-obj">%s</ul></div>'%('<div class="mp-h3">%s</div>'%t if t else '<div class="mp-h3">&nbsp;</div>',lis)
        mod='Module '+num if num.isdigit() else num
        sec.clear();sec['class']=sec['class']+['mp-ouv']
        sec.append(H(f'''{modh}<i class="mpband"></i><div class="mp-bande">{svg}<span class="mp-avenir">IMAGE DU MODULE À VENIR</span></div><div class="mp-mod">{mod.upper()}</div><div class="mp-num">{num}</div><div class="mp-dur">{(sp[1].get_text(strip=True) if len(sp)>1 else '').upper()}</div>
<div class="mp-bas"><h1>{ttl}</h1><div class="mp-intro">{it}</div><div class="mp-duo">{cols}</div></div><div class="mp-pied"><span>{sp[0].get_text(strip=True) if sp else ''}</span><span class="n"></span><img src="data:image/svg+xml;base64,{LG}"></div>'''))
        return str(so)
    a=hd.find('span',class_='tab');b=hd.find('span',class_='r')
    ft=sec.find('div',class_='ft',recursive=False)
    pd=''
    if ft:
        fs=ft.find('span');fb=ft.find('b')
        pd=f'<div class="mp-pied"><span>{fs.get_text(" ",strip=True) if fs else ""}</span><span class="n">{fb.get_text(strip=True) if fb else ""}</span><img src="data:image/svg+xml;base64,{LG}"></div>'
        ft.decompose()
    tete='<i class="mpband"></i>'+barre(i)+'<div class="mp-tete"><span><b>'+(a.get_text(strip=True) if a else '')+'</b>'+(' · '+b.get_text(' ',strip=True) if b else '')+'</span><span></span></div>'
    hd.decompose()
    body=so.new_tag('div');body['class']=['body']
    for c in list(sec.contents):
        if getattr(c,'name',None)=='h2' and 'modh' in (c.get('class') or []):continue
        body.append(c.extract())
    sec.append(H(tete));sec.append(body);sec.append(H(pd))
    for t in body.find_all('h1'):
        n=t.find('span',class_='n')
        if n:n.name='i';n.attrs={}
        t.name='h2';t['class']=['mp-h2']
    for d in body.select('div.dark'):
        tt=d.find('div',class_='t');x=tt.get_text(strip=True).lower() if tt else ''
        v='mp-sec' if re.search(r'attention|jamais|danger|erreur|piège|ne touche|on ne|haute tension|mercure|fume|absolue',x) else 'mp-sit'
        d['class']=['mp-enc',v]+d['class']
    for d in body.select('div.lime'):
        d['class']=['mp-enc','mp-ret']+d['class']
        f=d.find(True)
        if f and f.name in('b','div','h3') and len(f.get_text(strip=True))<60:f['class']=(f.get('class') or [])+['t']
    for q in body.select('div.quiz'):
        q['class']=['mp-act']+q['class'];h=q.find('span',class_='qh')
        if h:h['class']=['mp-act-t']+h['class']
    for t in body.select('table'):
        if t.find_parent('svg') is None:t['class']=(t.get('class') or [])+['mp-tab']
    return str(so)
r=''.join([s[:P[0]]]+[conv(i,s[P[i]:P[i+1]]) for i in range(len(P)-1)]+[s[P[-1]:]])
css=open('/home/claude/bibliotheque/format/livre-mp.css').read()
r=r.replace('</head>','<style id="mp-format">'+fonts+css+'</style></head>',1)
open(dst,'w',encoding='utf-8').write(r);print('ok',len(re.findall(r'class="page[^"]* me\b',r)),NM)
