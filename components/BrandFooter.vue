<template><view class="footer"><image src="/static/ui/logo.svg" mode="aspectFit"/><text>{{ config.copyright_text || 'Crowlook 内容与服务' }}</text></view></template>
<script setup>import {config} from '../lib/content'</script>
<style scoped>.footer{display:flex;flex-direction:column;align-items:center;padding:50rpx 0 54rpx;gap:24rpx}.footer image{width:132rpx;height:44rpx}.footer text{font-size:16rpx;color:#c8c8c8}</style>
