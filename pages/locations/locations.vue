<template><view><PageHeader title="门店地址" back-button/><view class="stores"><view v-for="s in config.site_add" :key="s.nam" class="store"><text class="name">乌鸦 Crowlook · {{s.nam}}</text><text class="address">{{s.add}}</text><text class="phone">{{s.tel}}</text><view class="actions"><button @click="map(s)">查看地图</button><button @click="copy(s)">复制地址</button><button @click="call(s)">联系电话</button></view></view></view><BrandFooter/></view></template>
<script setup>import {config} from '../../lib/content';import PageHeader from '../../components/PageHeader.vue';import BrandFooter from '../../components/BrandFooter.vue';const copy=s=>uni.setClipboardData({data:s.nam+' '+s.add});const call=s=>uni.showModal({title:s.nam,content:s.tel,confirmText:'复制号码',success:r=>{if(r.confirm)uni.setClipboardData({data:s.tel})}});const map=s=>{
// #ifdef H5
window.open('https://uri.amap.com/marker?position='+s.lng+','+s.lat+'&name='+encodeURIComponent('乌鸦Crowlook '+s.nam),'_blank','noopener');
// #endif
// #ifndef H5
uni.openLocation({latitude:Number(s.lat),longitude:Number(s.lng),name:'乌鸦Crowlook '+s.nam,address:s.add});
// #endif
}</script>
<style scoped>.stores{padding:35rpx 40rpx}.store{padding:32rpx 0 40rpx;border-bottom:1rpx solid #eee;display:flex;flex-direction:column;gap:20rpx}.name{font-size:30rpx;font-weight:600}.address,.phone{font-size:25rpx;color:#888;line-height:1.6}.actions{display:flex;gap:15rpx;margin-top:15rpx}.actions button{flex:1;font-size:23rpx;background:#f6f6f6;margin:0;padding:0;line-height:65rpx;border-radius:5rpx}</style>
