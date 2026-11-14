import re,sys,base64
from bs4 import BeautifulSoup
src,dst,a,b,livre,acc,prog=sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4]),sys.argv[5],sys.argv[6],sys.argv[7]
s=open(src,encoding='utf-8').read()
F=lambda n:base64.b64encode(open('/tmp/cvr/%s.woff'%n,'rb').read()).decode()
fonts="".join("@font-face{font-family:%s;src:url(data:font/woff;base64,%s) format('woff')}"%(n,F(n)) for n in ['MPI5','MPI6','MPI8','MPD9'])
LG=base64.b64encode(open('/home/claude/bibliotheque/img/metier-plus.svg','rb').read()).decode()
P=[m.start() for m in re.finditer(r'<section class="page',s)]
ren=lambda t,cls:(t.attrs.update({'class':cls}),t)[1]
def conv(h):
    so=BeautifulSoup(h,'html.parser');sec=so.section
    sec['class']=sec.get('class',[])+['mp'];sec['style']=(sec.get('style','')+f';--mp-c:{acc};--mp-p:{prog}')
    if 'trans' in sec['class']:
        mod=sec.select_one('h2.mod');sr=sec.select_one('h2.sr');k=sec.select_one('.k').get_text(strip=True)
        h1=sec.find('h1');parts=[x.strip() for x in h1.decode_contents().split('<br/>')]
        intro=sec.select_one('.intro');obj=[li.decode_contents() for li in sec.select('.obj li')]
        dur=sec.select_one('.dur');dur=dur.get_text(' ',strip=True) if dur else ''
        mots=[x.get_text(strip=True) for x in sec.select('span.pop') if len(x.get_text(strip=True))<25]
        ill=sec.find('svg');num=re.sub(r'\D','',k) or k
        at=None
        for d in sec.find_all('div'):
            if 'Atelier du module' in d.get_text() and d.find('b') and len(d.get_text())<260 and len(d.find_all('div'))>=1:at=d
        atel=''
        if at:
            ti=at.find('b').get_text(strip=True);rest='<br>'.join(x.decode_contents() for x in at.find_all('div',recursive=False)[1:])
            atel=f'<div class="mp-enc"><b class="t">{ti}</b>{re.sub(r' style="[^"]*"','',rest)}</div>'
        sec['class']=[c for c in sec['class'] if c!='trans']+['mp-ouv']
        sec.clear()
        sec.append(BeautifulSoup(f'''{mod or ''}{sr or ''}<i class="mpband"></i><div class="mp-bande">{ill or ''}<span class="mp-avenir">IMAGE DU MODULE À VENIR</span></div><div class="mp-mod">{k.upper()}</div><div class="mp-num">{num}</div><div class="mp-dur">{dur.upper()}</div>
<div class="mp-bas"><h1>{parts[0]}{'<br><span>'+' '.join(parts[1:])+'</span>' if len(parts)>1 else ''}</h1><div class="mp-intro">{re.sub(r' style="[^"]*"','',intro.decode_contents()) if intro else ''}</div>
<div class="mp-h3">Dans ce module, tu vas apprendre à…</div><ul class="mp-obj">{''.join('<li>'+o+'</li>' for o in obj)}</ul>
<div class="mp-h3">Mots clés du module</div><div class="mp-mots">{''.join('<span>'+m+'</span>' for m in mots)}</div>{atel}</div>
<div class="mp-pied"><span>{livre}</span><span class="n"></span><img src="data:image/svg+xml;base64,{LG}"></div>''','html.parser'))
        return str(so)
    top=sec.select_one('.top')
    if not top: return h
    if top:
        mn=top.select_one('.mn');tt=top.select_one('.tt')
        top.replace_with(BeautifulSoup(f'<i class="mpband"></i><div class="mp-tete"><span>'+(f'<b>{mn.get_text(strip=True)}</b> · ' if mn else '')+f'{tt.get_text(strip=True) if tt else ""}</span><span></span></div>','html.parser'))
    ft=sec.select_one('.foot')
    if ft:
        pn=ft.select_one('.pn');n=pn.get_text(strip=True) if pn else ''
        ft.replace_with(BeautifulSoup(f'<div class="mp-pied"><span>{livre}</span><span class="n">{n}</span><img src="data:image/svg+xml;base64,{LG}"></div>','html.parser'))
    for t in sec.select('h2.sec'):
        n=t.select_one('.n');
        if n:n.name='i';n.attrs={}
        t['class']=['mp-h2']
    sect=[t.find('i').get_text(strip=True) for t in sec.select('h2.mp-h2') if t.find('i')]
    tete=sec.select_one('.mp-tete span:last-child')
    if tete and sect and sect[0]!='✦':tete.string=sect[0]
    for t in sec.find_all('h3'):t['class']=['mp-h3']
    def lab(t,sel):
        l=t.select_one(sel)
        if l:l.name='b';l.attrs={'class':['t']}
    for t in sec.select('div.box.retiens'):t['class']=['mp-enc','mp-ret'];lab(t,'span.lab')
    for t in sec.select('div.box'):
        if 'mp-enc' not in t['class']:t['class']=['mp-enc'];lab(t,'span.lab')
    for t in sec.select('div.terrain'):
        t['class']=['mp-enc','mp-sit'];lab(t,'b.lab')
    for t in sec.select('div.cmp'):
        t['class']=['mp-cmp']
        for c in t.find_all('div',recursive=False):
            k='mp-sec' if 'no' in c.get('class',[]) else 'mp-ok';c['class']=['mp-enc',k];lab(c,'em')
    for t in sec.select('div.card'):
        t['class']=['mp-enc','mp-carte'];h4=t.find('h4')
        if h4:h4.name='b';h4.attrs={'class':['t']}
    for t in sec.select('table.t'):t['class']=['mp-tab']
    for t in sec.select('p.cap'):t['class']=['mp-cap']
    for t in sec.select('div.act'):
        t['class']=['mp-act'];l=t.select_one('span.lab')
        if l:l['class']=['mp-act-t']
    for t in sec.select('p.cons'):t['class']=['mp-intro']
    for t in sec.select('div.q'):t['class']=['mp-q']
    for t in sec.select('p.qq'):
        t['class']=['mp-qq'];k=t.select_one('b.k')
        if k:k.name='i';k.attrs={'class':['mp-no']};k.string=k.get_text(strip=True).rstrip('.')
    for t in sec.select('div.lines'):t['class']=['mp-lig']
    for t in sec.select('div.opts'):t['class']=['mp-ch']
    for t in sec.select('span.vf'):t['class']=['mp-vf']
    for t in sec.select('span.ok.reponse-choix'):t['class']=['reponse-choix']
    return str(so)
out=[s[:P[a]]]
for i in range(a,b):
    out.append(conv(s[P[i]:P[i+1]]))
out.append(s[P[b]:])
r=''.join(out)
css=open('/home/claude/bibliotheque/format/livre-mp.css').read()
r=r.replace('</head>','<style id="mp-format">'+fonts+css+'</style></head>',1)
open(dst,'w',encoding='utf-8').write(r);print('ok')
