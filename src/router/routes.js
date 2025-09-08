const routes = [
  
  // Rotas públicas (auth)
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/auth/LoginPage.vue'),
        meta: { guestOnly: true, title: 'Login' }
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/auth/RegisterPage.vue'),
        meta: { guestOnly: true, title: 'Criar conta' }
      }
    ]
  },

  // Rotas protegidas (app)
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('pages/dashboard/DashboardPage.vue'),
        meta: { title: 'Dashboard (Kanban)' }
      },
      {
        path: 'tasks',
        name: 'tasks.list',
        component: () => import('pages/tasks/TasksListPage.vue'),
        meta: { title: 'Tarefas' }
      },
      {
        path: 'tasks/create',
        name: 'tasks.create',
        component: () => import('pages/tasks/TaskCreatePage.vue'),
        meta: { title: 'Nova Tarefa' }
      },
      {
        path: 'tasks/:id',
        name: 'tasks.show',
        component: () => import('pages/tasks/TaskShowPage.vue'),
        props: true,
        meta: { title: 'Detalhe da Tarefa' }
      },
      {
        path: 'tasks/:id',
        name: 'tasks.edit',
        component: () => import('pages/tasks/TaskEditPage.vue'),
        props: true,
        meta: { title: 'Editar Tarefa' }
      },
      {
        path: 'notifications',
        name: 'notifications',
        component: () => import('pages/notifications/NotificationsPage.vue'),
        meta: { title: 'Notificações' }
      },
      {
        path: 'queues',
        name: 'queues.dashboard',
        component: () => import('pages/queues/QueueDashboardPage.vue'),
        meta: { title: 'Filas (Jobs)' }
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('pages/settings/SettingsPage.vue'),
        meta: { title: 'Configurações' }
      }
    ]
  },

  // 404
  {
    path: '/:catchAll(.*)*',
    name: 'notfound',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: { title: 'Página não encontrada' }
  }
]

export default routes
