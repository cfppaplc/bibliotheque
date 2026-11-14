import sys,os,re,io,base64
sys.path.insert(0,'/tmp/cvr');os.chdir('/tmp/cvr')
from couv import *;from livres import L
from bs4 import BeautifulSoup
from PIL import Image
def du(p):
    if not os.path.exists(p):return None
    im=Image.open(p).convert('RGB');im.thumbnail((1400,1400));b=io.BytesIO();im.save(b,'JPEG',quality=84);return 'data:image/jpeg;base64,'+base64.b64encode(b.getvalue()).decode()
LG=base64.b64encode(open("/home/claude/bibliotheque/img/metier-plus.svg","rb").read()).decode()
LGB=base64.b64encode(open("/home/claude/bibliotheque/img/metier-plus-blanc.svg","rb").read()).decode()
lg=f'<image href="data:image/svg+xml;base64,{LG}" x="500" y="760" width="62" height="24.4"/>'
lgb=f'<image href="data:image/svg+xml;base64,{LGB}" x="244" y="560" width="124" height="48.8"/>'
dark={'egi':'#1d2b26','plc':'#17243a'}
FIN=re.compile(r'^\s*(Lexique|Sources|Suivi|FIN DU PARCOURS|Protection incendie d.un b.timent Annexe|MODULE 13 · 436-274 ENTRETIEN DE MAT.RIEL .LECTRIQUE Sources)',re.I)
seul=sys.argv[1:]
for f,a,b,c,n,p,co,h,col in L:
    if seul and f not in seul:continue
    src='/tmp/dc/clair/%s.html'%f
    s=open(src,encoding='utf-8').read()
    so=BeautifulSoup(s,'lxml')
    p0=so.find(lambda t:t.name in('section','div') and 'page' in (t.get('class') or []))
    sib=[x for x in p0.parent.find_all(recursive=False) if 'page' in (x.get('class') or [])]
    def page_html(tag,inner):
        attrs=dict(tag.attrs);cl=attrs.get('class',[]);cl=' '.join(cl) if isinstance(cl,list) else cl
        st=(attrs.get('style','')+';position:relative;overflow:hidden').strip(';')
        at=''.join(f' {k}="{(" ".join(v) if isinstance(v,list) else v).replace(chr(34),"&quot;")}"' for k,v in attrs.items() if k not in('class','style'))
        return f'<{tag.name} class="{cl}" style="{st}"{at}>{inner}</{tag.name}>'
    cov=emballer(couverture(a,b,c,n,p,co,h,col,dark[p],du(f+'.jpg'),lg))
    finp=emballer(fin(a,b,n,p,col,'#1b2026' if p=='egi' else '#16203a',["Tu as terminé ce livre.","Garde-le : il te servira en stage et en emploi."],lgb))
    # repérer positions dans le texte source (pour ne pas re-sérialiser tout le livre)
    def span(tag,occ):
        m=[x for x in re.finditer(r'<%s\b[^>]*\bclass="[^"]*\bpage\b[^"]*"[^>]*>'%tag.name,s)]
        return m
    tags=list(re.finditer(r'<(section|div)\b[^>]*\bclass="([^"]*)"[^>]*>',s))
    def bornes(start,name):
        # trouver la fin du tag en comptant l'imbrication
        d=0;pat=re.compile(r'<(/?)%s\b[^>]*>'%name)
        for m in pat.finditer(s,start):
            if m.group(1)=='':d+=1
            else:
                d-=1
                if d==0:return m.end()
    pg=[t for t in tags if re.search(r'\bpage\b',t.group(2))]
    first=pg[0]; e1=bornes(first.start(),first.group(1))
    # dernier frère : le dernier .page qui commence après et de même nom au même niveau -> on prend la fin du dernier élément de sib
    lt=sib[-1]; ltxt=re.sub(r'\s+',' ',lt.get_text(' '))
    remplacer=len(ltxt)<1000 and not FIN.search(ltxt) and f!='administration-batiment'
    # localiser le dernier frère dans le texte : le dernier tag .page de même nom dont la fin n'est pas imbriquée
    cands=[t for t in pg if t.group(1)==lt.name]
    lastm=None
    for t in reversed(cands):
        en=bornes(t.start(),t.group(1));
        if en: lastm=(t,en);break
    out=s[:first.start()]+page_html(p0,cov)+s[e1:]
    delta=len(out)-len(s)
    t,en=lastm;st0=t.start()+delta;en+=delta
    if remplacer: out=out[:st0]+page_html(lt,finp)+out[en:]
    else:
        bare=BeautifulSoup(str(lt)[:0] or '<x></x>','lxml')
        tag=lt; out=out[:en]+page_html(tag,finp).replace(' data-n="','  data-old="')+out[en:]
    open('/tmp/dc/neuf/%s.html'%f,'w',encoding='utf-8').write(out)
    print(f,'fin remplacée' if remplacer else 'fin ajoutée',len(out)//1024,'Ko')
