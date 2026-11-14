"""Applique le thème des questions (14 nov.) à un livre déjà converti :
nouvelle feuille commune intégrée, lignes ajoutées là où une réponse dépasse ses lignes, préfixes « a) » retirés des choix.
Usage : questions.py <livre.html> <sortie.html> [lig.json (mesures de /tmp/aud/lig.js, clé = chemin du livre)]"""
import re,sys,json,base64
from bs4 import BeautifulSoup
src,dst=sys.argv[1],sys.argv[2]
M=json.load(open(sys.argv[3])).get(src,[]) if len(sys.argv)>3 else []
s=open(src,encoding='utf-8').read()
F=lambda n:base64.b64encode(open('/tmp/cvr/%s.woff'%n,'rb').read()).decode()
fonts="".join("@font-face{font-family:%s;src:url(data:font/woff;base64,%s) format('woff')}"%(n,F(n)) for n in ['MPI5','MPI6','MPI8','MPD9'])
css=open('/home/claude/bibliotheque/format/livre-mp.css').read()
s=re.sub(r'<style id="mp-format">.*?</style>',lambda m:'<style id="mp-format">'+fonts+css+'</style>',s,count=1,flags=re.S)
if 'lecture-plans' in src:s=re.sub(r'<section class="(page[^"]*\bmp\b(?![^"]*\bm3d\b)[^"]*)"',r'<section class="\1 m3d"',s)
P=[m.start() for m in re.finditer(r'<section class="page',s)]+[s.rfind('</body>')]
par={}
for i,j,t,v in M:par.setdefault(i,[]).append((j,t,v))
def sty(e,x):e['style']=(e.get('style','').rstrip(';')+';'+x).lstrip(';')
def conv(i,h):
    adm='adm' in h[:300]
    if i not in par and not adm:return h
    so=BeautifulSoup(h,'html.parser');sec=so.section
    if adm:
        for sp in sec.select('.mp-ch > span'):
            t=sp.find(string=True)
            if t and re.match(r'\s*[a-dA-D]\)\s+',t):t.replace_with(re.sub(r'^\s*[a-dA-D]\)\s+','',t))
    C=sec.select('.mp-lig, .lines, .ligne-rep, .line')
    for j,t,v in par.get(i,[]):
        if j>=len(C):continue
        c=C[j];a=c.find(['span','div'],class_=re.compile(r'\b(ans|reponse|rep-l)\b'),recursive=False)
        un=any(k in (c.get('class') or []) for k in ('ligne-rep','line'))
        if t=='h':
            st=c.get('style','');m=re.search(r'(?<![-\w])height:\s*(\d+(?:\.\d+)?)(px|in|pt)',st);mn=re.search(r'--n:\s*(\d+)',st)
            if m:c['style']=st[:m.start(1)]+str(round(float(m.group(1))*{'px':1,'in':96,'pt':96/72}[m.group(2)]+30*v))+'px'+st[m.end(2):]
            elif mn:c['style']=st[:mn.start(1)]+str(int(mn.group(1))+v)+st[mn.end(1):]
            else:sty(c,'padding-bottom:%dpx!important'%(30*v))
        elif un and a is not None:
            if v<=1.32:sty(a,'font-size:%.1fpx!important'%max(10.2,13.5/v/1.03))
            else:
                n=max(2,int(-(-v*1.1//1)));sty(c,'height:%dpx!important;border-bottom:0!important;background:repeating-linear-gradient(to bottom,transparent 0 29px,#b9c0c6 29px 30px)!important'%(30*n))
                sty(a,'white-space:normal!important;top:4px!important;bottom:auto!important;line-height:30px!important')
        elif v>1.15:sty(c,'padding-bottom:30px!important')
    return str(so)
r=''.join([s[:P[0]]]+[conv(i,s[P[i]:P[i+1]]) for i in range(len(P)-1)]+[s[P[-1]:]])
open(dst,'w',encoding='utf-8').write(r);print('ok',src,len(M))
