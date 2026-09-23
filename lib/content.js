import { reactive, shallowReactive } from 'vue'
import snapshot from '../data/snapshot.json'

export const reference = shallowReactive({ ...snapshot })
export const config = reactive({ ...(snapshot.discovery?.config?.ilank || {}) })
export const categories = reactive([...(snapshot.categories?.categories || [])])
export const allCategories = reactive(flattenCategories(categories))

const memory = {}
const livePosts = new Map()
let hydrationPromise

function flattenCategories(nodes) {
  return nodes.flatMap(item => [item, ...flattenCategories(item.children || [])])
}

function refreshCategoryIndex(nodes) {
  categories.splice(0, categories.length, ...nodes)
  allCategories.splice(0, allCategories.length, ...flattenCategories(nodes))
}

export const categoryById = id => allCategories.find(item => item.id === Number(id))

function apiBase() {
  const configured = String(import.meta.env.VITE_APP_API_BASE || '').trim()
  if (configured) return configured.endsWith('/') ? configured : `${configured}/`
  let base = 'http://127.0.0.1:8080/api/'
  // #ifdef H5
  base = '/content-api/'
  // #endif
  return base
}

function buildUrl(endpoint, params) {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
  return `${apiBase()}${endpoint}${query ? `?${query}` : ''}`
}

function callApi(endpoint, { method = 'GET', params = {}, data } = {}) {
  return new Promise((resolve, reject) => uni.request({
    url: buildUrl(endpoint, params),
    method,
    data,
    timeout: 20000,
    header: { 'Content-Type': 'application/json' },
    success: ({ data: body, statusCode }) => {
      if (statusCode >= 200 && statusCode < 300 && body?.errcode === 0) resolve(body)
      else reject(new Error(body?.message || '内容暂时无法加载，请重试'))
    },
    fail: () => reject(new Error('网络暂时不可用，请重试'))
  }))
}

export async function request(endpoint, params = {}, cacheKey = '') {
  const cached = cacheKey ? memory[cacheKey] : undefined
  if (cached && cached.expiresAt > Date.now()) return cached.data
  try {
    const data = await callApi(endpoint, { params })
    if (cacheKey) {
      const ttl = cacheKey.startsWith('post') ? 60 * 1000 : 5 * 60 * 1000
      memory[cacheKey] = { data, expiresAt: Date.now() + ttl }
    }
    for (const post of data.posts || []) livePosts.set(post.id, post)
    return data
  } catch (error) {
    if (cacheKey && snapshot[cacheKey]) return snapshot[cacheKey]
    throw error
  }
}

/**
 * 启动时用后端已发布内容刷新首页、发现页、品牌页与分类。
 * 本地快照在请求完成前提供首屏，也在后端离线时作为降级内容。
 */
export async function hydrateContent() {
  if (hydrationPromise) return hydrationPromise
  const tasks = [
    request('module/page.json', { key: 'home' }, 'home').then(data => { reference.home = data }),
    request('module/page.json', { key: 'discovery' }, 'discovery').then(data => {
      reference.discovery = data
      if (data.config?.ilank) Object.assign(config, data.config.ilank)
    }),
    request('module/page.json', { key: 'about' }, 'about').then(data => { reference.about = data }),
    request('category/list.json', {}, 'categories').then(data => {
      reference.categories = data
      refreshCategoryIndex(data.categories || [])
    })
  ]
  hydrationPromise = Promise.allSettled(tasks)
  try { await hydrationPromise } finally { hydrationPromise = undefined }
}

export async function submitComment(postId, content, nickname = '微信用户') {
  const body = await callApi('post/comment.json', {
    method: 'POST',
    data: { postId: Number(postId), content: content.trim(), nickname }
  })
  delete memory[`post${postId}`]
  return body
}

export const media = url => {
  const normalized = (url || '').replace(/^http:\/\//, 'https://')
  // #ifdef H5
  if (normalized.startsWith('https://cloud.video.taobao.com/play/')) return `/reference-video?src=${encodeURIComponent(normalized)}`
  // #endif
  return normalized
}

export function go(item) {
  uni.$emit('crowlook:pause-media')
  if (item.id && !item.path) { uni.navigateTo({ url: `/pages/articleDetail/articleDetail?id=${item.id}` }); return }
  if (item.path) {
    const tabs = { '/pages/discovery/discovery': '/pages/works/works', '/pages/about/about': '/pages/brand/brand', '/pages/home/home': '/pages/index/index', '/pages/me/me': '/pages/mine/mine' }
    const path = tabs[item.path]
    if (path) uni.switchTab({ url: path }); else uni.navigateTo({ url: item.path })
    return
  }
  if (item.type === 'mini') {
    // #ifdef MP-WEIXIN
    wx.openEmbeddedMiniProgram({ shortLink: item.link, allowFullScreen: true, fail: () => uni.navigateTo({ url: '/pages/service/service?booking=1' }) })
    // #endif
    // #ifndef MP-WEIXIN
    uni.navigateTo({ url: '/pages/service/service?booking=1' })
    // #endif
  }
}

export const back = () => { if (getCurrentPages().length > 1) uni.navigateBack(); else uni.switchTab({ url: '/pages/works/works' }) }
export const service = () => uni.navigateTo({ url: '/pages/service/service' })

const FAV = 'crowlook:favorites'
export const favorites = () => uni.getStorageSync(FAV) || []
export function toggleFavorite(post) {
  let items = favorites()
  const liked = items.some(item => item.id === post.id)
  items = liked ? items.filter(item => item.id !== post.id) : [{ id: post.id, title: post.title, thumbnail: post.thumbnail, category: post.category }, ...items]
  uni.setStorageSync(FAV, items)
  return !liked
}

export const searchLocal = term => {
  const snapshotPosts = Object.values(snapshot).flatMap(data => data.posts || [])
  const posts = [...snapshotPosts, ...livePosts.values()]
  return [...new Map(posts.map(post => [post.id, post])).values()]
    .filter(post => `${post.title} ${post.category?.map(item => item.name).join(' ')}`.toLowerCase().includes(term.toLowerCase()))
}
