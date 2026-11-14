"""C9 « Dispositifs électriques » : cadre commun Métier+ seulement (choix de Jeremy, 14 nov.).
En-tête, pied de page, bande du programme et barre « où on est rendu »; l'intérieur des pages n'est pas touché.
Usage : convertir_c9.py <clair> <sortie> "<couleur programme>" """
import re,sys,base64
from bs4 import BeautifulSoup
src,dst,prog=sys.argv[1],sys.argv[2],sys.argv[3]
so=BeautifulSoup(open(src,encoding='utf-8').read(),'html.parser')
F=lambda n:base64.b64encode(open('/tmp/cvr/%s.woff'%n,'rb').read()).decode()
fonts="".join("@font-face{font-family:%s;src:url(data:font/woff;base64,%s) format('woff')}"%(n,F(n)) for n in ['MPI5','MPI6','MPI8','MPD9'])
LG=base64.b64encode(open('/home/claude/bibliotheque/img/metier-plus.svg','rb').read()).decode()
H=lambda x:BeautifulSoup(x,'html.parser')
P=so.select('div.page')
CV=[i for i,p in enumerate(P) if 'cover' in p['class'] and i>0];NM=len(CV)
fait=0
for i,p in enumerate(P):
    pr=p.find('div',class_='pr',recursive=False)
    if not pr or 'cover' in p['class']:continue
    m=re.search(r'--hot:\s*(#[0-9a-fA-F]+)',p.get('style',''));acc=m.group(1) if m else '#F2A900'
    k=[x for x in pr.find_all(recursive=False)]
    hd=k[0] if k and ('hdr' in (k[0].get('class') or []) or 'height: 56px' in k[0].get('style','')) else None
    ft=[x for x in k if 'ftr' in (x.get('class') or []) or ('bottom: 0' in x.get('style','') and 'height: 48px' in x.get('style',''))]
    c=sum(1 for x in CV if x<=i)-1
    bar='<div class="mp-etapes">'+''.join('<i class="%s"></i>'%('cur' if j==c else 'on' if j<c else '') for j in range(NM))+'</div>'
    tete=''
    if hd:
        sp=hd.find_all(['span','b'],recursive=False)
        g=sp[0].get_text(' ',strip=True) if sp else '';d=sp[-1].get_text(' ',strip=True) if len(sp)>1 else ''
        a,_,b=d.partition('—')
        tete='<div class="mp-tete"><span><b>'+a.strip()+'</b>'+(' · '+b.strip() if b.strip() else '')+'</span><span>'+g+'</span></div>'
        nx=hd.find_next_sibling()
        if nx is not None and ('bar' in (nx.get('class') or []) or 'height: 6px' in nx.get('style','')):nx.decompose()
        hd.replace_with(H('<div class="mp-esp" style="height:62px;flex:none"></div>'+tete))
    pd=''
    if ft:
        f=ft[0];sp=f.find_all(['span','b'],recursive=False)
        pd=f'<div class="mp-pied"><span>{sp[0].get_text(" ",strip=True) if sp else ""}</span><span class="n">{sp[-1].get_text(strip=True) if len(sp)>1 else ""}</span><img src="data:image/svg+xml;base64,{LG}"></div>'
        f.replace_with(H(pd))
    pr.insert(0,H('<i class="mpband"></i>'+bar))
    p['class']=p['class']+['mpc','c9']+([] if hd else ['c9b'])
    p['style']=p.get('style','')+f';--mp-c:{acc};--mp-p:{prog}'
    fait+=1
r=str(so)
css=open('/home/claude/bibliotheque/format/livre-mp.css').read()
r=r.replace('</head>','<style id="mp-format">'+fonts+css+'</style></head>',1)
open(dst,'w',encoding='utf-8').write(r);print('ok',fait,len(P),NM)
