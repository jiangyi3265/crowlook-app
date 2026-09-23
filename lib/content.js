import snapshot from '../data/snapshot.json'
export const reference = snapshot
export const config = snapshot.discovery.config.ilank
export const categories = snapshot.categories.categories
export const allCategories = categories.flatMap(c => [c,...(c.children||[])])
export const categoryById = id => allCategories.find(c=>c.id===Number(id))
export const media = url => {
 const normalized=(url||'').replace(/^http:\/\//,'https://')
 // #ifdef H5
 if(normalized.startsWith('https://cloud.video.taobao.com/play/'))return '/reference-video?src='+encodeURIComponent(normalized)
 // #endif
 return normalized
}
const memory = {}
export async function request(endpoint, params={}, cacheKey='') {
 if(cacheKey && (memory[cacheKey] || snapshot[cacheKey])) return memory[cacheKey] || snapshot[cacheKey]
 let base='https://crow.richs.vip/api/'
 // #ifdef H5
 base='/reference-api/'
 // #endif
 const query=Object.entries(params).filter(([,v])=>v!==undefined&&v!=='').map(([k,v])=>`${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
 return new Promise((resolve,reject)=>uni.request({url:base+endpoint+'?'+query,timeout:20000,success:({data,statusCode})=>{if(statusCode===200&&data?.errcode===0){if(cacheKey)memory[cacheKey]=data;resolve(data)}else reject(new Error('内容暂时无法加载，请重试'))},fail:()=>reject(new Error('网络暂时不可用，请重试'))}))
}
export function go(item) {
 uni.$emit('crowlook:pause-media')
 if(item.id && !item.path){uni.navigateTo({url:'/pages/articleDetail/articleDetail?id='+item.id});return}
 if(item.path){const tabs={'/pages/discovery/discovery':'/pages/works/works','/pages/about/about':'/pages/brand/brand','/pages/home/home':'/pages/index/index','/pages/me/me':'/pages/mine/mine'};const path=tabs[item.path];if(path)uni.switchTab({url:path});else uni.navigateTo({url:item.path});return}
 if(item.type==='mini'){
  // #ifdef MP-WEIXIN
  wx.openEmbeddedMiniProgram({shortLink:item.link,allowFullScreen:true,fail:()=>uni.navigateTo({url:'/pages/service/service?booking=1'})})
  // #endif
  // #ifndef MP-WEIXIN
  uni.navigateTo({url:'/pages/service/service?booking=1'})
  // #endif
 }
}
export const back=()=>{if(getCurrentPages().length>1)uni.navigateBack();else uni.switchTab({url:'/pages/works/works'})}
export const service=()=>uni.navigateTo({url:'/pages/service/service'})
const FAV='crowlook:favorites'
export const favorites=()=>uni.getStorageSync(FAV)||[]
export function toggleFavorite(post){let items=favorites();const liked=items.some(x=>x.id===post.id);items=liked?items.filter(x=>x.id!==post.id):[{id:post.id,title:post.title,thumbnail:post.thumbnail,category:post.category},...items];uni.setStorageSync(FAV,items);return !liked}
export const searchLocal = term => [...new Map(Object.values(snapshot).flatMap(d=>d.posts||[]).map(p=>[p.id,p])).values()].filter(p=>(p.title+' '+p.category?.map(c=>c.name).join(' ')).toLowerCase().includes(term.toLowerCase()))
