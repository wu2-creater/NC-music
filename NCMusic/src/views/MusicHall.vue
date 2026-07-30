<script setup name="MusicHall">
import { ref, onMounted, computed } from 'vue'

import { useRouter } from 'vue-router'
const router = useRouter()

import api from '@/api'

//推荐歌单
const playList = ref([])
//推荐新音乐
const newMusicList = ref([])
//歌手榜单
const singerRank = ref([])
//当前展示的歌手榜单片段
const currentSingerSlice = ref(0)
//歌手榜单片段数量
const SINGER_SLICE_COUNT = 5
//处理每个歌手榜单片段:左右切换
const singerSlices = computed(() => {
  //list为每一页展示的歌手榜单片段
  const list = singerRank.value || []
  //所有轮播图的页数数据
  const slices=[]
  for(let i=0;i<list.length;i+=SINGER_SLICE_COUNT){
    slices.push(list.slice(i,i+SINGER_SLICE_COUNT))
  }
  // console.log(slices);
  return slices
})
//切换歌手榜单片段
const preSingerSlice = () => {
  if(!singerSlices.value.length) return
  currentSingerSlice.value = (currentSingerSlice.value-1+singerSlices.value.length)%singerSlices.value.length
  // console.log(currentSingerSlice.value);
  
}
const nextSingerSlice = () => {
  if(!singerSlices.value[currentSingerSlice.value]) return
  currentSingerSlice.value = (currentSingerSlice.value+1)%singerSlices.value.length
  // console.log(currentSingerSlice.value);
}


//获取推荐歌单
const fetchPlayList = async () => {
  try {
    const res = await api.get('/personalized',{limit:5})
    playList.value = (res.result || []).map(item => ({
      id: item.id,
      title: item.name,
      copywriter: item.copywriter||'',
      cover: item.picUrl
    }))
  } catch (error) {
    console.error('获取音乐列表失败:', error)
  }
  // console.log(playList.value);
}
//获取推荐新音乐
const fetchNewMusicList = async () => {
  try {
    const res = await api.get('/personalized/newsong')
    newMusicList.value = (res.result || []).map(item => ({
      id: item.id,
      name: item.name,
      cover: item.picUrl,
      artist: item.song?.artists.map((a) => a.name).join('/') || ''
    }))
  } catch (error) {
    console.error('获取音乐列表失败:', error)
  }
  // console.log(newMusicList.value);
}
//获取歌手榜单
const fetchSingerRank = async () => {
  try {
    const res = await api.get('/top/artists',{limit:30})
    singerRank.value = (res.artists || []).map((artist,index) => ({
      id: artist.id,
      name: artist.name,
      rank: index+1,
      avatar: artist.picUrl,
    }))
  } catch (error) {
    console.error('获取歌手榜单失败:', error)
  }
  // console.log(singerRank.value);
}

onMounted(() => {
    fetchPlayList()
    fetchNewMusicList()
    fetchSingerRank()
})
//点击推荐歌单跳转到音乐列表页
const handlePlaylistClick = (id) => {
  if(!id) return
  router.push({ name: 'musicList', query: { id } })
}
</script>


<template>
  <div class="hall-wrapper">
    <div class="hall-inner">
      <!-- 推荐歌单 -->
      <h2>推荐歌单</h2>
      <ul class="playlist-list">
        <li v-for="item in playList" 
          :key="item.id" 
          class="playlist-item"
          @click="handlePlaylistClick(item.id)"
          >
          <div class="cover-wrapper">
            <img :src="item.cover" alt="item.title">
          </div>
          <div class="info">
            <p class="title">{{ item.title }}</p>
            <p class="desc">{{ item.copywriter}}</p>
          </div>
        </li>
      </ul>
      <!-- 推荐新音乐 -->
      <h2 class="section-title section-title--sub">推荐新音乐</h2>
      <ul class="song-list">
        <li v-for="item in newMusicList" 
          :key="item.id" 
          class="song-item">
          <div class="song-cover">
            <img :src="item.cover" alt="item.name">
          </div>
          <div class="song-info">
            <p class="song-name">{{ item.name }}</p>
            <p class="song-artist">{{ item.artist }}</p>
          </div>
        </li>
      </ul>
      <!-- 歌手榜单轮播图 -->
      <h2 class="section-title section-title--sub section-title--singer">歌手榜单</h2>
      <div class="singer-carousel" v-if="singerSlices.length">
        <div class="singer-carousel-track">
        <div 
        v-for="(slide,index) in singerSlices" 
        :key="index" 
        class="singer-slide"
        v-show="index === currentSingerSlice"
        >
        <ul class="singer-list">
          <li v-for="singer in slide" 
            :key="singer.id" 
            class="singer-item">
            <div class="singer-avatar">
              <img :src="singer.avatar" alt="singer.name">
            </div>
            <span class="singer-name">{{ singer.rank }}. {{ singer.name }}</span>
          </li>
        </ul>
        </div>
        </div>
        <!-- 左右按钮 -->
        <div class="singer-carousel-controls" v-if="singerSlices.length > 1">
          <button class="singer-arrow" @click="preSingerSlice"> < </button>
          <button class="singer-arrow" @click="nextSingerSlice"> > </button>
        </div>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
.hall-wrapper {
  display: flex;
  justify-content: center;
}

.hall-inner {
  width: 100%;
  max-width: 1200px;
}

.section-title {
  margin: 0 0 16px;
  margin-top: 40px;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.section-title--sub {
  margin-top: 40px;
}

.section-title--singer {
  margin-top: 68px;
  font-size: 22px;
  text-align: center;
}

.playlist-list {
  display: flex;
  gap: 20px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.playlist-item {
  flex: 1;
  max-width: 220px;
  cursor: pointer;
}

.cover-wrapper {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 4px;
  overflow: hidden;
  background: #eee;
  cursor: pointer;
}

.cover-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.cover-wrapper:hover img {
  transform: scale(1.06);
}

.info {
  margin-top: 8px;
}

.title {
  font-size: 14px;
  color: #333;
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.desc {
  font-size: 12px;
  color: #999;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 40px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.song-item {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.song-cover {
  width: 82px;
  height: 82px;
  border-radius: 4px;
  overflow: hidden;
  background: #eee;
  flex-shrink: 0;
  cursor: pointer;
}

.song-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.song-cover:hover img {
  transform: scale(1.2);
}

.song-info {
  flex: 1;
}

.song-name {
  font-size: 14px;
  color: #333;
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  font-size: 12px;
  color: #999;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.singer-list {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  justify-content: space-between;
}

.singer-item {
  width: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.singer-avatar {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  background: #eee;
  flex-shrink: 0;
}

.singer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.singer-name {
  font-size: 16px;
  color: #333;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.singer-carousel {
  margin-top: 12px;
  position: relative;
}

.singer-carousel-track {
  position: relative;
  min-height: 200px;
}

.singer-slide {
  width: 100%;
}

.singer-carousel-controls {
  position: absolute;
  inset: 0;
  margin: 0;
  pointer-events: none;
}

.singer-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: #f2f2f2;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
  pointer-events: auto;
}

.singer-arrow:first-of-type {
  left: -30px;
}

.singer-arrow:last-of-type {
  right: -30px;
}

.singer-arrow:hover {
  background: #e5e5e5;
}
</style>