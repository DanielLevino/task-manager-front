import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/auth'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  });
  
  // --- Guard global ---
  Router.beforeEach(async (to) => {
    const auth = useAuthStore();

    // Título da aba
    if (to.meta && to.meta.title) {
      document.title = `${to.meta.title} • Task Manager`
    }

    if (!auth.user) {
      await auth.fetchMe();
    }

    // Rotas que exigem autenticação
    if (to.meta && to.meta.requiresAuth && !auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    // Rotas apenas para visitantes
    if (to.meta && to.meta.guestOnly && auth.isAuthenticated) {
      return { name: 'dashboard' }
    }

    return true
  })
  
  return Router
})
