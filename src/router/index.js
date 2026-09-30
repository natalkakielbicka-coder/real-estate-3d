import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Presentation3DView.vue'),
    },
    {
      path: '/prezentacja-3d',
      redirect: '/',
    },
  ],
})

export default router
