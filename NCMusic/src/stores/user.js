import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'nc_user'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)

  //判断用户是否登录了
  const isLoggedIn = computed(() => user.value !== null)

  //状态管理，pinia加本地存储
  const setUser = (payload) => {
    if (!payload) {
      return
    }
    const normalizedUser = {
      id: payload.id,
      nickname: payload.nickname,
      avatar: payload.avatar,
      // 其他需要的字段
    }
    user.value = normalizedUser
    // 保存到本地存储
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedUser))
  }

  const clearUser = () => {
    user.value = null
    // 从本地存储中移除用户信息
    localStorage.removeItem(STORAGE_KEY)
  }

  // 从本地存储中获取用户信息
  const initFromLocalStorage = () => {
    const userJson = localStorage.getItem(STORAGE_KEY)
    if (!userJson) {
      return
    }
    const parsed = JSON.parse(userJson)
    if (parsed && parsed.id) {
      user.value = parsed
    }
  }

  initFromLocalStorage()

  return {
    user,
    isLoggedIn,
    setUser,
    clearUser,
    // initFromLocalStorage
  }
})