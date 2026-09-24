<template>
  <view>
    <PageHeader :title="booking ? '定制拍摄' : '联系乌鸦'" back-button />
    <view class="service">
      <image class="logo" src="/static/ui/logo.svg" mode="aspectFit" />
      <text class="heading">{{ booking ? '定制你的专属影像' : `${config.site_name || '乌鸦 Crowlook'} · 联系客服` }}</text>
      <view class="qr-frame" role="button" aria-label="查看客服二维码大图" @click="preview">
        <image class="qr-art" :src="serviceQr" mode="aspectFit" />
      </view>
      <text class="hint">长按识别二维码，或复制微信号添加客服</text>
      <button class="copy" @click="copy">微信号：{{ config.site_kf || 'Crowlook' }}　复制</button>
      <button v-if="booking && bookingLink" class="stores" @click="questionnaire">复制{{ bookingName }}入口　›</button>
      <button class="stores" @click="locations">查看门店地址　›</button>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { config, media } from '../../lib/content'
import PageHeader from '../../components/PageHeader.vue'

const booking = ref(false)
const bookingLink = computed(() => config.site_form?.[0]?.link || '')
const bookingName = computed(() => config.site_form?.[0]?.nam || '定制拍摄问卷')
const serviceQr = computed(() => media(config.site_wxkf || '/static/contact/kefu.jpg'))

onLoad(options => { booking.value = !!options.booking })

const copy = () => uni.setClipboardData({ data: config.site_kf || 'Crowlook' })
const preview = () => uni.previewImage({ urls: [serviceQr.value] })
const questionnaire = () => {
  if (!bookingLink.value) return
  uni.setClipboardData({
    data: bookingLink.value,
    success: () => uni.showToast({ title: '已复制，请在微信中打开', icon: 'none' })
  })
}
const locations = () => uni.navigateTo({ url: '/pages/locations/locations' })
</script>

<style scoped>
.service{padding:40rpx 50rpx 60rpx;display:flex;flex-direction:column;align-items:center}.logo{height:70rpx;width:220rpx}.heading{font-size:30rpx;margin:28rpx 0 34rpx}.qr-frame{width:580rpx;height:580rpx;max-width:100%;position:relative;overflow:hidden;border-radius:8rpx;background:#fff}.qr-art{width:100%;height:100%}.hint{font-size:22rpx;color:#999;margin:28rpx 0;text-align:center}.copy{background:#111;color:#fff;width:100%;font-size:26rpx;line-height:85rpx;border-radius:6rpx}.stores{background:transparent;font-size:25rpx;color:#777;margin-top:25rpx}
</style>
