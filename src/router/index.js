import Vue from 'vue';
import VueRouter from 'vue-router';
import AppHome from '../views/AppHome.vue';
import AppLogin from '../views/AppLogin.vue';
import CodeDetail from '../views/CodeDetail.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'Home', component: AppHome },
  { path: '/login', name: 'Login', component: AppLogin },
  { path: '/code/:id', name: 'CodeDetail', component: CodeDetail },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.path !== '/login' && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;