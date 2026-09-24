<template><view v-if="modelValue" class="overlay" @click="close"><view class="sheet" @click.stop><view class="sheet-header"><button class="close" aria-label="关闭评论" @click="close"><CrowIcon name="cross"/></button><text>{{ replyTo ? `回复 ${replyTo.nickname || '微信用户'}` : '写评论' }}</text><button class="publish" :disabled="submitting" @click="publish">{{ submitting ? '提交中' : '发表' }}</button></view><view v-if="replyTo" class="replying">正在回复：{{ replyTo.content }}</view><textarea v-model="draft" :placeholder="replyTo ? `回复 ${replyTo.nickname || '微信用户'}（审核通过后公开显示）` : '说两句吧（审核通过后公开显示）'" :focus="true" maxlength="1000"/></view></view></template>
<script setup>
import { ref, watch } from 'vue'
import CrowIcon from './CrowIcon.vue'
import { submitComment } from '../lib/content'

const props = defineProps({ modelValue: Boolean, postId: [String, Number], replyTo: Object })
const emit = defineEmits(['update:modelValue', 'submitted'])
const draft = ref('')
const submitting = ref(false)

watch(() => props.modelValue, value => {
  if (value) draft.value = uni.getStorageSync(`crowlook:draft:${props.postId}`) || ''
})

const close = () => {
  if (submitting.value) return
  uni.setStorageSync(`crowlook:draft:${props.postId}`, draft.value)
  emit('update:modelValue', false)
}

const publish = async () => {
  const content = draft.value.trim()
  if (!content) { uni.showToast({ title: '评论内容不能为空', icon: 'none' }); return }
  submitting.value = true
  try {
    await submitComment(props.postId, content, '', props.replyTo?.id)
    draft.value = ''
    uni.removeStorageSync(`crowlook:draft:${props.postId}`)
    emit('submitted')
    emit('update:modelValue', false)
    uni.showModal({ title: '评论已提交', content: '审核通过后会显示在作品评论区。', showCancel: false })
  } catch (error) {
    uni.setStorageSync(`crowlook:draft:${props.postId}`, draft.value)
    uni.showToast({ title: error.message || '提交失败，请稍后重试', icon: 'none' })
  } finally {
    submitting.value = false
  }
}
</script>
<style scoped>.overlay{position:fixed;inset:0;background:linear-gradient(to bottom,transparent 116rpx,rgba(0,0,0,.72) 116rpx);z-index:80}.sheet{position:absolute;bottom:0;left:0;right:0;height:67%;background:#fff;border-radius:30rpx 30rpx 0 0;padding:30rpx 30rpx}.sheet-header{display:flex;align-items:center;justify-content:center;position:relative;height:54rpx;font-size:16px;font-weight:700}.close{position:absolute;left:10rpx;background:none;padding:0;line-height:1;font-size:24px}.publish{position:absolute;right:0;background:#07c160;color:#fff;font-size:14px;line-height:56rpx;border-radius:40rpx;padding:0 28rpx;font-weight:400}.publish[disabled]{opacity:.55}.replying{margin:28rpx 14rpx 0;padding:18rpx 22rpx;border-radius:12rpx;background:#f6f6f6;color:#777;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sheet textarea{margin:28rpx 14rpx;width:calc(100% - 28rpx);height:68%;font-size:16px;line-height:1.6}</style>
