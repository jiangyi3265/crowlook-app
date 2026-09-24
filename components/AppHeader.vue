<template>
<view class="app-header">
 <view v-if="search" class="brand-search" @click="showSearch"><text class="brand-word">乌鸦</text><text class="search-divider">|</text><view class="search-icon"/></view>
 <!-- #ifndef MP-WEIXIN -->
 <view class="system-capsule" aria-label="小程序窗口控件">
  <button class="capsule-action" aria-label="更多" @click="showMore"><view class="dots"><view/><view/><view/></view></button><view class="capsule-separator"/>
  <button class="capsule-action" aria-label="窗口提示" @click="showWindow"><view class="minus"/></button><view class="capsule-separator"/>
  <button class="capsule-action" aria-label="返回首页" @click="goHome"><view class="circle"><view/></view></button>
 </view>
 <!-- #endif -->
</view>
</template>
<script setup>
defineProps({search:Boolean})
const showMore=()=>uni.showActionSheet({itemList:['关于乌鸦 Crowlook','返回首页'],success:({tapIndex})=>tapIndex===1?goHome():uni.showModal({title:'乌鸦 Crowlook',content:'专注人物影像与定制拍摄服务。',showCancel:false})})
const goHome=()=>uni.reLaunch({url:'/pages/index/index'})
const showWindow=()=>uni.showToast({title:'欢迎来到乌鸦 Crowlook',icon:'none'})
const showSearch=()=>uni.navigateTo({url:'/pages/search/search'})
</script>
<style scoped>
.app-header{position:relative;height:156.7rpx;background:#fff;z-index:2}
.system-capsule{position:absolute;right:11rpx;top:47rpx;width:215rpx;height:58rpx;border:1rpx solid #e8e8e8;border-radius:40rpx;display:flex;align-items:center;box-sizing:border-box;background:rgba(255,255,255,.9)}
.capsule-action{background:none;margin:0;padding:0;flex:1;height:56rpx;display:flex;justify-content:center;align-items:center}.capsule-separator{height:31rpx;width:1rpx;background:#d6d6d6}
.dots{display:flex;gap:4rpx;align-items:center}.dots view{background:#1c1c1c;width:7rpx;height:7rpx;border-radius:50%}.dots view:nth-child(2){width:12rpx;height:12rpx}
.minus{height:5rpx;width:25rpx;border-radius:8rpx;background:#1c1c1c}.circle{width:30rpx;height:30rpx;border:4rpx solid #1c1c1c;border-radius:50%;display:flex;align-items:center;justify-content:center}.circle view{width:11rpx;height:11rpx;border-radius:50%;background:#1c1c1c}
.brand-search{position:absolute;left:20rpx;top:47rpx;height:58rpx;width:171rpx;border:1rpx solid #eee;border-radius:40rpx;display:flex;align-items:center;justify-content:center;gap:15rpx}.brand-word{font-weight:900;font-size:29rpx}.search-divider{font-size:22rpx;color:#ddd}.search-icon{height:16rpx;width:16rpx;border:2rpx solid #111;border-radius:50%;position:relative}.search-icon:after{content:"";position:absolute;width:8rpx;height:2rpx;background:#111;transform:rotate(45deg);right:-6rpx;bottom:-3rpx}
</style>
