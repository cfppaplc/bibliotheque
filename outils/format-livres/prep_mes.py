import sys
s=open(sys.argv[1],encoding='utf-8').read()
s=s.replace('</head>','<style>body{overflow:visible!important;height:auto!important}#spread,#stage,#desk{display:block!important;transform:none!important;position:static!important;height:auto!important;width:auto!important}.page{display:block!important;position:relative!important;visibility:visible!important;opacity:1!important;margin:10px!important;left:auto!important;top:auto!important;transform:none!important;animation:none!important}.page :is(.ans,.reponse){visibility:visible!important}</style><script>document.addEventListener("DOMContentLoaded",()=>document.body.classList.add("h-rep","answers","corr","corrige"))</script></head>',1)
open('/tmp/mp/mesure.html','w',encoding='utf-8').write(s)
