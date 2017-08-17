let isctId = 0
const cacheMap = new Map()

export default {
  setIsctEl(el) {
    el.dataset.isctId = isctId++
    cacheMap.set(el.dataset.isctId, el)
  },
  getIsctEl(id) {
    return cacheMap.get(id)
  },
  removeIsctEl(el) {
    cacheMap.delete(el.dataset.isctId)
  }
}
