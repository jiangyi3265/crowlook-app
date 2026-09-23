import { execFile } from 'node:child_process'
const API='https://crow.richs.vip/api'
const endpoints=new Set(['/post/list.json','/post/get.json','/module/page.json','/category/list.json','/post/comment/list.json'])
const mobileAgent='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 MicroMessenger/8.0.50'
const cache=new Map()
export function referenceRequest(req,res){
 const url=new URL(req.url,'http://localhost')
 if(!url.pathname.startsWith('/reference-api/')&&url.pathname!=='/reference-video')return false
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405).end();return true}
 if(url.pathname==='/reference-video'){
  let source;try{source=new URL(url.searchParams.get('src'))}catch{res.writeHead(400).end();return true}
  if(source.hostname!=='cloud.video.taobao.com'||!/^\/play\/u\/(?:null|\d+)\/p\/\d+\/e\/\d+\/t\/\d+\/\d+\.mp4$/.test(source.pathname)){res.writeHead(400).end();return true}
  // The original public endpoint serves mobile clients, then redirects to a short-lived CDN URL.
  // Resolve that redirect at request time instead of shipping expired CDN signatures.
  const key=source.pathname,hit=cache.get(key)
  const redirect=location=>res.writeHead(302,{Location:location,'Cache-Control':'no-store'}).end()
  if(hit&&hit.expires>Date.now()){redirect(hit.url);return true}
  execFile('curl',['-sSI','--max-time','15','-A',mobileAgent,'https://cloud.video.taobao.com'+source.pathname],{maxBuffer:64000},(error,headers)=>{
   const location=headers?.match(/^location:\s*(.+)$/im)?.[1]?.trim()
   let target;try{target=new URL(location)}catch{}
   if(error||!target||target.protocol!=='https:'||!(target.hostname.endsWith('.taobao.com')||target.hostname.endsWith('.alicdn.com'))){res.writeHead(502).end();return}
   cache.set(key,{url:target.href,expires:Date.now()+5*60*1000});redirect(target.href)
  });return true
 }
 const path=url.pathname.slice('/reference-api'.length)
 if(!endpoints.has(path)){res.writeHead(404).end();return true}
 execFile('curl',['-fsSL','--max-time','18',API+path+url.search],{maxBuffer:5*1024*1024},(error,body)=>{
  if(error){res.writeHead(502).end('{}');return}
  try{const data=JSON.parse(body);delete data.current_user;if(data.config?.ilank)delete data.config.ilank.map_key;res.writeHead(200,{'Content-Type':'application/json; charset=utf-8'}).end(JSON.stringify(data))}catch{res.writeHead(502).end('{}')}
 });return true
}
