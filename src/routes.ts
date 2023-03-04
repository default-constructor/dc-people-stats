import {createRouter, createWebHistory} from 'vue-router'
import AliensView from './views/AliensView.vue'
import RefugeesView from './views/RefugeesView.vue'
import CrimesView from './views/CrimesView.vue'
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
    component: AliensView
  },
  {
    name: 'refugees',
    path: '/refugees',
    component: RefugeesView
  },
  {
    name: 'crimes',
    path: '/crimes',
    component: CrimesView
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
