import { createRouter, createWebHistory } from 'vue-router'
import MusicHall from '../views/MusicHall.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'musicHall',
      component: MusicHall,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/musicList',
      name: 'musicList',
      component: () => import('../views/MusicList.vue'),
    },
    {
      path: '/myMusic',
      name: 'myMusic',
      component: () => import('../views/MyMusic.vue'),
    },
    {
      path: '/player',
      name: 'player',
      component: () => import('../views/Player.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/Search.vue'),
    }
  ],
})

export default router
