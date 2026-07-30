<script setup name="Login">
import { ref, onMounted,watch,onBeforeUnmount } from 'vue'
import api  from '../api'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

// 引入路由
const router = useRouter()

// 引入用户状态管理
const userStore = useUserStore()

// 二维码图片
const qrImg = ref('')

// 登录key
const loginKey = ref('')

//轮询定时器
const qrCheckTimer=ref(null)

// 点击登录弹窗外部关闭弹窗
const handleOverlayClick = (e) => {
  if(e.target === e.currentTarget){
    // 点击了弹窗外部，关闭弹窗
    router.push('/')
  }
}

//获取二维码登录的key
const fetchLoginKey = async () => {
  try {
    const res = await api.get('/login/qr/key')
    loginKey.value = res.data?.unikey || ''
  } catch (error) {
    console.error('获取登录key失败:', error)
    loginKey.value = ''
  }
}

//根据登录key获取二维码图片
const fetchQrImg = async (key) => {
  if (!key) {
    return
  }
  try {
      const res = await api.get('/login/qr/create',{
        key,
        timestamp: Date.now(),
        ua:'pc',
        qrimg:true
      }) 
      // console.log(res)
      qrImg.value = res.data?.qrimg || ''
    } catch (error) {
      console.error('获取二维码失败:', error)
      qrImg.value = ''
    }
}

// 监听登录key变化，获取二维码图片
watch(
  () => loginKey.value, 
  (newKey) => {
    if (newKey) {
      fetchQrImg(newKey)
    }
  }
)

//监听用户是否登录了，轮询检查登录状态，成功后保存用户信息
const startQrCheck = async (key) => {
  if (!key) {
    return
  }
  if (qrCheckTimer.value) {
    clearInterval(qrCheckTimer.value)
  }
  qrCheckTimer.value = setInterval(async () => {
    try {
      const res = await api.get('/login/qr/check',{
        key,
        timestamp: Date.now(),
        ua:'pc'
      }) 
      //常见状态码：800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies),如扫码后返回 502
      // 检查登录状态
      if (res.code === 803) {
        // 登录成功，清除定时器
        clearInterval(qrCheckTimer.value)
        qrCheckTimer.value = null
      }

      //授权成功，登录状态接口返回用户信息
      try{
        const userStatusRes = await api.get('/login/status',{
        timestamp: Date.now(),
        ua:'pc'
      })
      const profile = userStatusRes.data?.profile
      // console.log(profile)
      if (profile) {
        // 登录成功，保存用户信息
        userStore.setUser({
          id: profile.userId,
          nickname: profile.nickname,
          avatar: profile.avatarUrl,
        })
        // 登录成功，关闭弹窗
        router.push('/')
      }
      } catch (error) {
        console.error('获取用户登录状态失败:', error)
      }
    } catch (error) {
      console.error('检查二维码登录状态失败:', error)
    }
  }, 3000) 
}

// 监听二维码图片变化，轮询检查登录状态
watch(
  () => qrImg.value,
  (newQrImg) => {
    if (newQrImg&&loginKey.value) {
      startQrCheck(loginKey.value)
    }
  }
)

// 组件挂载时获取登录key
onMounted(() => {
  fetchLoginKey()
})

// 组件卸载时清除定时器
onBeforeUnmount(() => {
  if (qrCheckTimer.value) {
    clearInterval(qrCheckTimer.value)
    qrCheckTimer.value = null
  }
})
</script>

<template>
  <div class="login-overlay" @click="handleOverlayClick">
    <div class="login-modal">
      <!-- 标题 -->
      <div class="login-header">
        <h2>扫码登录网易云音乐</h2>
        <p>请使用网易云音乐APP扫码登录</p>
      </div>
      <!-- 二维码 -->
      <div class="login-body">
        <div class="qrcode-box">
          <!-- 二维码占位符 -->
          <div class="qrcode-placeholder">
            <template v-if="qrImg">
              <img :src="qrImg" alt="登录二维码">
            </template>
            <template v-else>
              <span>二维码加载中...</span>
            </template>
          </div>
          <p class="qrcode-tip">请使用网易云音乐APP扫描二维码</p>
        </div>
        <ul class="login-features">
          <li>同步收藏的歌单，歌曲和播放列表</li>
          <li>多端同步播放</li>
          <li>提供音乐推荐</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.login-modal {
  width: 420px;
  padding: 24px 32px 32px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
}

.login-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.login-header p {
  margin: 8px 0 0;
  font-size: 13px;
  color: #666;
}

.login-body {
  margin-top: 20px;
  display: flex;
  gap: 20px;
}

.qrcode-box {
  text-align: center;
}

.qrcode-placeholder {
  width: 140px;
  height: 140px;
  border-radius: 4px;
  background: #f5f5f5;
  border: 1px solid #e1e1e1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

.qrcode-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.qrcode-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

.login-features {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
  color: #555;
}

.login-features li + li {
  margin-top: 8px;
}
</style>