const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:816,height:1056},deviceScaleFactor:0.515});
const L=JSON.parse(fs.readFileSync('/tmp/cvr/liste.json'));
for(const f of L){const s=fs.readFileSync('/tmp/cvr/seule/'+f+'.html','utf8');await p.setContent(s);await p.waitForTimeout(3600);
await p.screenshot({path:'/tmp/cvr/vign/'+f+'.jpg',type:'jpeg',quality:82});}
await b.close()})();
