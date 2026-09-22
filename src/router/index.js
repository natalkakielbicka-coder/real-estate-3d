import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/prezentacja-3d',
      name: 'presentation-3d',
      component: () => import('../views/Presentation3DView.vue'),
    },
  ],
})

export default router
