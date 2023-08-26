import { createRouter, createWebHashHistory } from 'vue-router';

import Layout from '@/layout/Layout.vue';
import Home from '@/views/Home/Home.vue';
import Writings from '@/views/Writings/Writings.vue';
import Comments from '@/views/Comments/Comments.vue';
import Status from '@/views/Status/Status.vue';
const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/',
    children: [
      { path: '', component: Home },
      { path: ':txId?', component: Writings },
      { path: '/writings/:path*', component: Writings },
      { path: 'comments', component: Comments },
      { path: 'status', component: Status },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
