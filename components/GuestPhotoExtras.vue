<template>
  <view v-if="isGuestCase" class="guest-extras">
    <text v-if="savedNote" class="guest-note">{{ savedNote }}</text>
    <image v-for="(src, index) in photos" :key="index" class="guest-photo" :src="src" mode="widthFix" @click="preview(src)" />
    <button class="edit-trigger" @click="editing = !editing">{{ editing ? '收起编辑' : photos.length ? '继续添加详细客片' : '添加详细客片' }}</button>
    <view v-if="editing" class="editor">
      <text class="editor-title">补充客片详情</text>
      <textarea v-model="note" maxlength="300" placeholder="为这组客片写一段说明（可选）" />
      <view v-for="(src, index) in photos" :key="index" class="editor-photo">
        <image :src="src" mode="aspectFill" />
        <button @click="remove(index)">移除</button>
      </view>
      <button class="add-photo" :disabled="busy || photos.length >= 6" @click="add">{{ busy ? '正在保存照片…' : photos.length >= 6 ? '最多添加 6 张' : '选择照片' }}</button>
      <button class="save" @click="save">保存详情</button>
      <text class="local-hint">新增内容保存在当前设备，仅自己可见。</text>
    </view>
  </view>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { getGuestPhotos, saveGuestPhotos, keepGuestPhoto, discardGuestPhoto } from '../lib/guestPhotos'

const props = defineProps({ post: { type: Object, required: true }, existingImages: { type: Array, default: () => [] } })
const isGuestCase = computed(() => props.post.category?.some(category => Number(category.id) === 160))
const photos = ref([])
const note = ref('')
const savedNote = ref('')
const editing = ref(false)
const busy = ref(false)

watch(() => props.post.id, id => {
  const saved = getGuestPhotos(id)
  photos.value = saved.photos
  note.value = saved.note
  savedNote.value = saved.note
  editing.value = false
}, { immediate: true })

const persist = (nextPhotos = photos.value, nextNote = note.value) => saveGuestPhotos(props.post.id, { photos: nextPhotos, note: nextNote })
const preview = src => uni.previewImage({ urls: [...props.existingImages, ...photos.value], current: src })

function add() {
  if (busy.value || photos.value.length >= 6) return
  uni.chooseImage({
    count: 6 - photos.value.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async result => {
      busy.value = true
      const incoming = []
      try {
        for (const path of result.tempFilePaths) incoming.push(await keepGuestPhoto(path))
        const next = [...photos.value, ...incoming]
        persist(next, savedNote.value)
        photos.value = next
        uni.showToast({ title: '客片已添加', icon: 'none' })
      } catch (error) {
        incoming.forEach(discardGuestPhoto)
        uni.showToast({ title: '照片保存失败，请减少照片数量', icon: 'none' })
      } finally {
        busy.value = false
      }
    }
  })
}

function remove(index) {
  const next = photos.value.filter((_, photoIndex) => photoIndex !== index)
  try {
    persist(next, savedNote.value)
    discardGuestPhoto(photos.value[index])
    photos.value = next
  } catch (error) {
    uni.showToast({ title: '移除失败', icon: 'none' })
  }
}

function save() {
  try {
    const trimmed = note.value.trim()
    persist(photos.value, trimmed)
    note.value = trimmed
    savedNote.value = trimmed
    editing.value = false
    uni.showToast({ title: '详情已保存', icon: 'none' })
  } catch (error) {
    uni.showToast({ title: '保存失败，请减少内容', icon: 'none' })
  }
}
</script>

<style scoped>
.guest-extras{margin:0 40rpx 50rpx}
.guest-note{display:block;margin:8rpx 0 32rpx;font-size:27rpx;line-height:1.7;color:#444;white-space:pre-wrap}
.guest-photo{display:block;width:100%;margin-bottom:40rpx;border-radius:10rpx}
.edit-trigger{display:block;width:100%;margin:30rpx 0 0;background:#fff;border:1rpx solid #d6d6d6;border-radius:8rpx;color:#555;font-size:24rpx;line-height:76rpx}
.editor{margin-top:24rpx;padding:28rpx;background:#f7f7f7;border-radius:10rpx}
.editor-title{display:block;margin-bottom:18rpx;font-size:27rpx;font-weight:600;color:#222}
.editor textarea{width:100%;min-height:150rpx;padding:20rpx;background:#fff;border:1rpx solid #e6e6e6;border-radius:6rpx;font-size:24rpx;line-height:1.6}
.editor-photo{display:flex;align-items:center;gap:24rpx;margin-top:18rpx}
.editor-photo image{width:110rpx;height:110rpx;border-radius:6rpx}
.editor-photo button{margin:0;padding:0;background:none;color:#777;font-size:23rpx}
.add-photo,.save{width:100%;margin-top:26rpx;border-radius:6rpx;font-size:25rpx;line-height:76rpx}
.add-photo{background:#fff;border:1rpx solid #d6d6d6;color:#222}
.add-photo[disabled]{opacity:.5}
.save{background:#222;color:#fff}
.local-hint{display:block;margin-top:20rpx;text-align:center;font-size:20rpx;color:#999}
</style>
