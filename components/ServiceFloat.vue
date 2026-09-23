<template><button class="service-float" aria-label="联系客服" @click="service"><image src="/static/ui/floating-contact.svg" mode="aspectFit"/></button></template>
<script setup>import {service} from '../lib/content'</script>
<style scoped>.service-float{position:fixed;z-index:22;right:20rpx;bottom:calc(200rpx + env(safe-area-inset-bottom));padding:0;width:90rpx;height:90rpx;border-radius:50%;background:transparent}.service-float image{width:100%;height:100%}</style>
