<template>
  <view class="home-page">
    <AppHeader />
    <view v-if="!playing" class="home-photo" role="img" aria-label="乌鸦 Crowlook 杭州店，粉色艺术长廊">
      <image class="reference-photo" :src="media(config.home_image || '/static/reference/home.webp')" mode="widthFix" />
    </view>
    <video v-if="playing" id="home-film" class="home-film" :src="media(heroVideo)" autoplay controls object-fit="contain" @ended="playing=false" @error="videoFailed"/>
    <view v-if="!playing" class="home-caption">{{ config.home_caption || '乌鸦 Crowlook · 杭州店' }}</view>
    <view v-if="!playing" class="home-statement">
      <text class="statement-cn">{{ config.home_statement_cn || '不需要任何外界的审视' }}</text>
      <text class="statement-en">{{ config.home_statement_en || 'no single injector unlocks this' }}</text>
    </view>
    <view v-if="!playing && !scrolled" class="playback-shade"><button class="playback-button" aria-label="播放品牌影像" @click="showVideoInfo"><view class="pause-line"/><view class="pause-line"/></button></view>
    <button class="service-button" aria-label="客服" @click="showServiceInfo"><view class="bubble"><view class="smile"/></view></button>
    <view class="home-more"><ModuleContent :modules="reference.home.modules.slice(1)"/><BrandFooter/></view>
    <AppTabs current="home" />
  </view>
</template>
<script setup>
import AppHeader from '../../components/AppHeader.vue'
import AppTabs from '../../components/AppTabs.vue'
import { computed, ref } from 'vue'
import { onPageScroll } from '@dcloudio/uni-app'
import { config, media, reference, service } from '../../lib/content'
import ModuleContent from '../../components/ModuleContent.vue'
import BrandFooter from '../../components/BrandFooter.vue'
const playing=ref(false),scrolled=ref(false)
const heroVideo=computed(()=>reference.home?.modules?.[0]?.content?.[0]?.video||'')
onPageScroll(e=>scrolled.value=e.scrollTop>80)
const videoFailed=()=>{playing.value=false;uni.showToast({title:'视频暂时无法播放，请稍后重试',icon:'none'})}
const showVideoInfo=()=>{if(!heroVideo.value){uni.showToast({title:'品牌视频暂未配置',icon:'none'});return}playing.value=true;uni.pageScrollTo({scrollTop:0,duration:0})}
const showServiceInfo=service
</script>
<style scoped>
.home-film{width:100%;height:1155rpx;display:block;background:#fff}.home-more{margin-top:45rpx}
.home-page{min-height:100vh;background:#fff;padding-bottom:100rpx;box-sizing:border-box;position:relative;overflow:hidden}
.home-photo{position:relative;width:calc(100% - 21rpx);height:937.5rpx;overflow:hidden}
.reference-photo{position:absolute;left:0;top:-156.7rpx;width:750rpx;max-width:none;pointer-events:none}
.home-caption{margin:12rpx 17rpx 0;color:#fa00d3;font-size:24rpx;line-height:36rpx;letter-spacing:.1rpx}
.home-statement{margin-top:49rpx;text-align:center;color:#000;display:flex;flex-direction:column;align-items:center}
.statement-cn{font-size:42rpx;font-weight:700;line-height:55rpx;white-space:nowrap}
.statement-en{font-family:"Times New Roman",serif;font-weight:700;font-size:29rpx;line-height:37rpx}
.playback-shade{position:fixed;z-index:4;left:0;right:0;bottom:calc(100rpx + env(safe-area-inset-bottom));height:86rpx;background:linear-gradient(transparent,rgba(0,0,0,.5));pointer-events:none}
.playback-button{position:absolute;left:22rpx;bottom:12rpx;width:56rpx;height:56rpx;display:flex;gap:12rpx;align-items:center;justify-content:center;padding:0;background:none;pointer-events:auto}
.pause-line{height:26rpx;width:3rpx;border-radius:2rpx;background:rgba(255,255,255,.65)}
.service-button{position:fixed;right:35rpx;bottom:calc(231rpx + env(safe-area-inset-bottom));z-index:5;width:64rpx;height:64rpx;background:none;padding:0;overflow:visible}
.bubble{position:absolute;inset:3rpx;background:#fff;border:1rpx solid #fafafa;border-radius:50%;box-shadow:2rpx 3rpx 2rpx #d5d5d5}
.bubble:before{content:"";position:absolute;left:3rpx;bottom:0;width:15rpx;height:17rpx;background:#fff;border-radius:2rpx;transform:rotate(19deg);box-shadow:0 2rpx 1rpx #ddd}
.smile{position:absolute;left:20rpx;top:26rpx;width:17rpx;height:11rpx;border-bottom:3rpx solid #ccc;border-radius:50%}
</style>
