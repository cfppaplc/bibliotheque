import json,re,sys
f=sys.argv[1];r=json.load(open('/tmp/mp/mesure.json'))
s=open(f,encoding='utf-8').read()
P=[m for m in re.finditer(r'<section class="page[^"]*"[^>]*>',s)]
need={x[0]:x[1] for x in r if x[1] is not None and x[1]<-2}
out=[];last=0
for i,m in enumerate(P):
    tag=m.group(0)
    if i in need:
        H=902;k0=float((re.findall(r"--mpz:([0-9.]+)",tag) or [1])[-1]);k=max(.8,round(k0*(H-6)/(H-need[i]/k0),3))
        tag=re.sub(r'style="([^"]*)"',lambda x:'style="'+x.group(1)+f';--mpz:{k}"',tag,1)
    out.append(s[last:m.start()]);out.append(tag);last=m.end()
out.append(s[last:]);open(f,'w',encoding='utf-8').write(''.join(out));print('ajustées',len(need))
