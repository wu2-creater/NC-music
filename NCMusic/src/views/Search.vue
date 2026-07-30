<script setup name="Search">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'


const route = useRoute()
const router = useRouter()

const keyword = computed(() => (route.query.keyword  || '').toString())

const songList = ref([])
const loading = ref(false)

const fetchSearchResult = async () => {
  const kw = keyword.value.trim()
  // 清空搜索结果
  songList.value = []
  if (!kw) {
    return
  }
  loading.value = true
  try{
    const res = await api.get('/search', { keywords: kw })
  // console.log(res)
  const songs = res.result?.songs || []
  // console.log(songs)
  songList.value = songs.map(s => ({
    id: s.id,
    name: s.name,
    artist: (s.artists||[]).map(a => a.name).join('/') || '',
    album: s.album.name || '',
    duration: s.duration || 0
  }))
  // console.log(songList.value)
  }catch(err){
    console.error('搜索失败:', err)
  }finally{
    loading.value = false
  }
}
// 格式化时间
const formatDuration = (ms) => {
  if(!ms) return '00:00'
  // 转换为秒级时间
  const totalSec = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSec / 60)
  const seconds = Math.floor(totalSec % 60)
  return `${minutes<10?'0'+minutes:minutes}:${seconds < 10 ? '0' + seconds : seconds}`
}

// 处理播放点击事件
const handlePlay = (songId) => {
  if(!songId) return
  router.push({ name: 'player', query: { id: songId } })
}

watch(
  () => keyword.value,
  () => {
      fetchSearchResult()
    }
)

onMounted(() => {
  fetchSearchResult()
  console.log(keyword.value)
})

</script>

<template>
  <div class="search-page">
    <div class="search-inner">
      <h2 class="title">搜索结果：</h2>
      <p class="keyword" v-if="keyword">搜索关键字：{{ keyword }}</p>
      <p v-else class="keyword">搜索结果为空，请输入搜索关键字</p>

      <div v-if="loading" class="tip">正在搜索中...</div>
      <div v-else-if="!songList.length && keyword" class="tip">未搜索到与‘{{ keyword }}’相关的歌曲</div>
      <!-- <p class="tip">共 {{ songList.length }} 条搜索结果</p> -->
      
      <ul v-else class="song-list">
        <li v-for="song in songList" 
        :key="song.id" 
        class="song-item"
        @click="handlePlay(song.id)">
          <div class="song-main">
            <span class="song-name">{{ song.name }}</span>
            <span class="song-artist">{{ song.artist }}</span>
          </div>
          <div class="song-extra">
            <span class="song-album">{{ song.album }}</span>
            <span class="song-duration">{{ formatDuration(song.duration) }}</span>
          </div>
        </li>
      </ul>

    </div>
  </div>
</template>

<style scoped>
.search-page {
  min-height: calc(100vh - 90px);
  padding: 24px 32px;
  box-sizing: border-box;
}

.search-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 600;
}

.keyword {
  margin: 0 0 16px;
  font-size: 14px;
  color: #666;
}

.tip {
  margin-top: 24px;
  font-size: 14px;
  color: #888;
}

.song-list {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.song-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid #f2f2f2;
  cursor: pointer;
  font-size: 13px;
}

.song-item:last-of-type {
  border-bottom: none;
}

.song-item:hover {
  background: #fafafa;
}

.song-main {
  display: flex;
  flex-direction: column;
  max-width: 60%;
}

.song-name {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  margin-top: 2px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-extra {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 40%;
  justify-content: flex-end;
}

.song-album {
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-duration {
  color: #999;
  flex-shrink: 0;
}
</style>