"""Réduit (débordement) ou grossit un peu (grand blanc) le contenu des pages .mp d'après /tmp/mp/mesure.json.
Usage : ajuster2.py livre.html [grossir_max]"""
import json,re,sys
f=sys.argv[1];G=float(sys.argv[2]) if len(sys.argv)>2 else 1.0;MN=float(sys.argv[3]) if len(sys.argv)>3 else .72
r=json.load(open('/tmp/mp/mesure.json'));s=open(f,encoding='utf-8').read()
P=list(re.finditer(r'<section class="page[^"]*"[^>]*>',s));out=[];last=0;n=0
for i,m in enumerate(P):
    tag=m.group(0);x=r[i] if i<len(r) else [i,None]
    if x[1] is not None:
        H=564 if x[2] else 902;k0=float((re.findall(r"--mpz:([0-9.]+)",tag) or [1])[-1]);used=(H-x[1])
        k=None
        if x[1]<-2: k=max(MN,round(max(k0*(H-8)/used,k0*.94),3))
        elif G>1 and x[1]>110 and k0<G and not x[2]: k=min(G,round(k0*(H-30)/used,3))
        if k and abs(k-k0)>.005:
            tag=re.sub(r';--mpz:[0-9.]+','',tag);tag=re.sub(r'style="([^"]*)"',lambda y:'style="'+y.group(1)+f';--mpz:{k}"',tag,1);n+=1
    out.append(s[last:m.start()]);out.append(tag);last=m.end()
out.append(s[last:]);open(f,'w',encoding='utf-8').write(''.join(out));print('ajustées',n,'déborde',sum(1 for x in r if x[1] is not None and x[1]<-2))
