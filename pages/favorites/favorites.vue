<template>
  <view class="page">
    <PageHeader title="我的点赞" back-button />
    <view v-if="items.length" class="list">
      <PostGrid :posts="items" />
    </view>
    <view v-else class="empty">
      <CrowIcon name="like-o" />
      <text class="empty-title">还没有点赞的客片</text>
      <text class="empty-copy">喜欢的作品，点进详情后轻点爱心就会收藏在这里。</text>
      <button @click="browse">去看客片</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { favorites } from '../../lib/content'
import PageHeader from '../../components/PageHeader.vue'
import PostGrid from '../../components/PostGrid.vue'
import CrowIcon from '../../components/CrowIcon.vue'

const items = ref([])
onShow(() => { items.value = favorites() })
const browse = () => uni.switchTab({ url: '/pages/works/works' })
</script>

<style scoped>
.page{min-height:100vh;background:#fff}
.list{padding-top:40rpx}
.empty{min-height:calc(100vh - 116rpx);padding:180rpx 56rpx 120rpx;display:flex;flex-direction:column;align-items:center;text-align:center;color:#777}
.empty .crow-icon{font-size:72rpx;color:#c5c5c5}
.empty-title{margin-top:42rpx;font-size:30rpx;font-weight:600;color:#222}
.empty-copy{margin-top:18rpx;max-width:520rpx;font-size:23rpx;line-height:1.7;color:#999}
.empty button{margin-top:52rpx;padding:0 48rpx;border:1rpx solid #333;border-radius:50rpx;background:#fff;color:#222;font-size:25rpx;line-height:76rpx}
</style>
