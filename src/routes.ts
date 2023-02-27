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
    name: 'aliens',
    path: '/aliens',
    component: AliensStatsView
  },
  {
    name: 'refugees',
    path: '/refugees',
    component: RefugeesStatsView
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
