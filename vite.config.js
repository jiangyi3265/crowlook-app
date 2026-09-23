import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { referenceRequest } from './scripts/reference-server.mjs'
export default defineConfig({plugins:[uni(),{name:'public-reference',configureServer(server){server.middlewares.use((req,res,next)=>{if(!referenceRequest(req,res))next()})}}]})
