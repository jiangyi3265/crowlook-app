import http from 'node:http'
import {readFile,stat} from 'node:fs/promises'
import {resolve,extname,sep} from 'node:path'
import {referenceRequest} from './reference-server.mjs'
const root=resolve('dist/build/h5'),port=Number(process.env.PORT||5175)
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2'}
http.createServer(async(req,res)=>{if(referenceRequest(req,res))return;const url=new URL(req.url,'http://localhost');if(req.method!=='GET'){res.writeHead(405).end();return}try{const path=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!path.startsWith(root+sep)){res.writeHead(403).end();return}await stat(path);res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Referrer-Policy':'no-referrer'}).end(await readFile(path))}catch{res.writeHead(404).end('Not found')}}).listen(port,'127.0.0.1',()=>console.log(`Crowlook H5: http://127.0.0.1:${port}`))
