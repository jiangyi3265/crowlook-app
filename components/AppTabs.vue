<template>
<view class="app-tabs" role="navigation" aria-label="主导航">
 <button v-for="tab in tabs" :key="tab.id" class="tab" :class="{active:current===tab.id}" :aria-label="tab.label" @click="open(tab)"><image class="tab-icon" :src="'/static/icons/'+tab.id+(current===tab.id?'-active':'')+'.png'" mode="aspectFit"/><text>{{tab.label}}</text></button>
</view>
</template>
<script setup>
import {onMounted} from 'vue'
onMounted(()=>uni.hideTabBar({animation:false}))
const props=defineProps({current:{type:String,default:'home'}})
const tabs=[{id:'home',label:'首页',path:'index'},{id:'works',label:'作品',path:'works'},{id:'brand',label:'品牌',path:'brand'},{id:'mine',label:'我的',path:'mine'}]
const open=tab=>{uni.$emit('crowlook:pause-media');if(tab.id!==props.current)uni.switchTab({url:`/pages/${tab.path}/${tab.path}`,fail:e=>console.error(e.errMsg)})}
</script>
<style scoped>
.app-tabs{position:fixed;bottom:0;left:0;right:0;height:100rpx;padding-bottom:env(safe-area-inset-bottom);border-top:1rpx solid #eee;background:#fff;display:flex;z-index:20;box-sizing:content-box}
.tab{flex:1;background:none;border:0;border-radius:0;padding:13rpx 0 6rpx;margin:0;display:flex;flex-direction:column;align-items:center;gap:3rpx;line-height:28rpx;color:#969696;font-size:19rpx;font-weight:500}
.tab-icon{width:50rpx;height:50rpx}.tab.active{color:#080808}.tab.active .tab-icon{opacity:1}
</style>
