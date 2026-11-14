"""Ajoute la barre « où on est rendu » (un trait par module) en haut des pages .mp.
Usage : python3 etapes.py livre.html  (modifie le fichier; refait proprement si déjà fait)"""
import re,sys
f=sys.argv[1];t=open(f,encoding='utf-8').read()
t=re.sub(r'<div class="mp-etapes">.*?</div>','',t)
n=max(int(x) for x in re.findall(r'class="mp-tete"><span><b>Module (\d+)</b>',t))
def barre(m):
    k=int(m.group(1)) if m.group(1) else 0
    seg=''.join('<i class="%s"></i>'%('cur' if i==k else 'on' if i<k else '') for i in range(1,n+1))
    return '<div class="mp-etapes">'+seg+'</div>'+m.group(0)
t=re.sub(r'<div class="mp-tete"><span>(?:<b>Module (\d+)</b>)?',barre,t)
css='.page.mp .mp-etapes{position:absolute;left:72px;right:60px;top:22px;display:flex;gap:4px;z-index:3}.page.mp .mp-etapes i{flex:1;height:5px;border-radius:3px;background:#e3e6e9}.page.mp .mp-etapes i.on{background:var(--mp-c);opacity:.4}.page.mp .mp-etapes i.cur{background:var(--mp-c)}'
if '.mp-etapes{' not in t: t=t.replace('</style>',css+'</style>',1) if 'id="mp-format"' not in t else re.sub(r'(<style id="mp-format"[^>]*>)',r'\1'+css,t,1)
open(f,'w',encoding='utf-8').write(t);print(n,'modules,',t.count('class="mp-etapes"'),'barres')
