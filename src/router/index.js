import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/home.view.vue';
import LogView from '@/views/log.view.vue';
import DatabaseService from '@/services/database.service';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/logs',
      name: 'logs',
      component: LogView
    },
    {
      path: '/logs/:query',
      name: 'logs-query',
      component: LogView
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (
    (to.name === 'logs' || to.name === 'logs-query') &&
    DatabaseService.database === null
  ) {
    next({ name: 'home' });
  } else {
    next();
  }
})

export default router;
