
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/login', component: () => import('pages/Login.vue') },
      { path: '/Registration', component: () => import('pages/Registration.vue') },
      { path: '/Map', component: () => import('pages/Map.vue') },
      { path: '/Dashboard', component: () => import('pages/Dashboard.vue') },
      { path: '/', redirect: '/Login' }

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
