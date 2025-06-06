import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/use-chat',
    name: 'UseChat',
    component: () => import('../views/UseChat.vue')
  },
  {
    path: '/chat-ui-demo',
    name: 'ChatUIDemo',
    component: () => import('../views/ChatUIDemo.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 