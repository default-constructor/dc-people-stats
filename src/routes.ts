import {createRouter, createWebHistory} from 'vue-router';
import AliensStatsView from './views/AliensStatsView.vue';
import Home from './views/Home.vue';

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home
  },
  {
    name: 'aliens-stats',
    path: '/aliens-stats',
    component: AliensStatsView
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
