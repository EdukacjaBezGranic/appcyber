import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const args=process.argv.slice(2);
const port=Number(args[args.indexOf('--port')+1]||4173);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.mp4':'video/mp4','.woff2':'font/woff2','.woff':'font/woff','.pdf':'application/pdf'};
http.createServer((req,res)=>{
 const url=new URL(req.url,'http://local');
 if(url.pathname==='/__layout-check'){
  const width=Math.min(1920,Math.max(320,Number(url.searchParams.get('width'))||390));
  const target=url.searchParams.get('path')||'index.html';
  if(!/^[a-zA-Z0-9/_-]+\.html$/.test(target)){res.writeHead(400);res.end();return;}
  res.setHeader('Content-Type','text/html; charset=utf-8');res.end(`<!doctype html><html><head><title>Responsive preview ${width}px</title><style>body{margin:0;background:#d9dde0;display:flex;justify-content:center}iframe{border:0;width:${width}px;height:100vh;flex:none;background:white}</style></head><body><iframe title="Responsive preview" src="/${target}"></iframe></body></html>`);return;
 }
 let filename;
 try{filename=path.resolve(root,'.'+decodeURIComponent(url.pathname));}catch{res.writeHead(400);res.end();return;}
 if(!filename.startsWith(root+path.sep)&&filename!==root){res.writeHead(403);res.end();return;}
 if(fs.existsSync(filename)&&fs.statSync(filename).isDirectory())filename=path.join(filename,'index.html');
 fs.stat(filename,(error,stat)=>{
  if(error||!stat.isFile()){res.writeHead(404);res.end('Not found');return;}
  res.setHeader('Content-Type',types[path.extname(filename)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');
  const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  if(range){const start=Number(range[1]),end=Math.min(Number(range[2]||stat.size-1),stat.size-1);if(start>end){res.writeHead(416);res.end();return;}res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});fs.createReadStream(filename,{start,end}).pipe(res);}
  else{res.setHeader('Content-Length',stat.size);fs.createReadStream(filename).pipe(res);}
 });
}).listen(port,'0.0.0.0');
