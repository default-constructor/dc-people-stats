import {createRouter, createWebHistory} from 'vue-router'
import AliensStatsView from './views/AliensStatsView.vue'
import RefugeesStatsView from './views/RefugeesStatsView.vue'
import Home from './views/Home.vue'

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
  {
    name: 'refugees-stats',
    path: '/refugees-stats',
    component: RefugeesStatsView
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
