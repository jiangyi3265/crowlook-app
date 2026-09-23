const key = id => `crowlook-content:guest-photos:${id}`

export function getGuestPhotos(id) {
  const saved = uni.getStorageSync(key(id))
  return saved && typeof saved === 'object'
    ? { note: typeof saved.note === 'string' ? saved.note : '', photos: Array.isArray(saved.photos) ? saved.photos : [] }
    : { note: '', photos: [] }
}

export function saveGuestPhotos(id, value) {
  uni.setStorageSync(key(id), { note: value.note, photos: value.photos })
}

export async function keepGuestPhoto(path) {
  // #ifdef H5
  const response = await fetch(path)
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  try {
    return await new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => {
        const scale = Math.min(1, 1280 / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(image.width * scale)
        canvas.height = Math.round(image.height * scale)
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.76))
      }
      image.onerror = () => reject(new Error('照片无法读取'))
      image.src = url
    })
  } finally {
    URL.revokeObjectURL(url)
  }
  // #endif
  // #ifdef MP-WEIXIN
  return new Promise((resolve, reject) => {
    uni.saveFile({ tempFilePath: path, success: result => resolve(result.savedFilePath), fail: reject })
  })
  // #endif
}

export function discardGuestPhoto(path) {
  // #ifdef MP-WEIXIN
  uni.removeSavedFile({ filePath: path })
  // #endif
}
