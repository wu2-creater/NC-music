<script setup name="MyMusic">
import { ref, computed ,onMounted, } from 'vue'
import api from '@/api'
import { useUserStore } from '@/stores/user'
import {useRouter} from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const playLists = ref([])

//网络请求获取我的音乐
const fetchUserPlayLists = async () => {
  const uid = userStore.user?.id
  if (!uid) {
    return
  }
  try {
    const res = await api.get('/user/playlist',{uid})
    // console.log(res)
    playLists.value = res.playlist?.map(item => ({
      id: item.id,
      name: item.name,
      cover: item.coverImgUrl,
      trackCount: item.trackCount
    })) || []
    // console.log(playLists.value)
  } catch (error) {
    console.error('获取我的音乐失败:', error)
  }
}

// 组件挂载时获取我的音乐
onMounted(() => {
  fetchUserPlayLists()
})

// 跳转登录页
const handleGoLogin = () => {
  router.push('/login')
}

// 打开歌单详情页
const handleOpenPlaylist = (id) => {
  if (!id) {
    return
  }
  router.push({
    path: '/musiclist',
    query: {
      id
    }
  })
}



</script>

<template>
  <div class="mymusic-page">
    <div class="mymusic-inner">
      <h2 class="title">我的音乐</h2>
      <!-- 判断是否有登录 -->
      <div v-if="!userStore.isLoggedIn" class="login-hint">
        <p class="hint-text">请先登录查看您的音乐</p>
        <button @click="handleGoLogin" class="hint-btn">登录</button>
      </div>
      <div v-else>
        <p class="subtitle">我的歌单列表</p>
        <div v-if="!playLists.length" class="tip">暂无歌单，请先创建歌单或收藏歌单</div>
        <ul v-else class="playlist-list">
          <li v-for="item in playLists" 
          :key="item.id"  
          class="playlist-item"
          @click="handleOpenPlaylist(item.id)"
          >
            <div class="cover">
              <img :src="item.cover" alt="歌单封面">
            </div>
            <div class="info">
              <p class="name">{{item.name}}</p>
              <p class="count">共{{item.trackCount}}首</p>
            </div>
          </li>

        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mymusic-page {
  min-height: calc(100vh - 90px);
  padding: 24px 32px;
  box-sizing: border-box;
}

.mymusic-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  margin: 0 0 16px;
  font-size: 20px;
  font-weight: 600;
}

.subtitle {
  margin: 0 0 12px;
  font-size: 16px;
  color: #333;
}

.login-hint {
  margin-top: 24px;
  padding: 24px 28px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.hint-text {
  margin: 0 0 12px;
  font-size: 14px;
  color: #555;
}

.hint-btn {
  padding: 6px 16px;
  border-radius: 16px;
  border: none;
  background: #c20c0c;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.hint-btn:hover {
  background: #a00a0a;
}

.tip {
  margin-top: 16px;
  font-size: 14px;
  color: #777;
}

.playlist-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
}

.playlist-item {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.cover {
  width: 100%;
  aspect-ratio: 1/1;
  overflow: hidden;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.info {
  padding: 8px 10px 10px;
}

.name {
  margin: 0 0 4px;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.count {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>