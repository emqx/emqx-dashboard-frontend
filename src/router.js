import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store'
import newFeaturesMenu from './data_map/new_features_menu'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('~/views/Login'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('~/components/Home'),
    children: [
      {
        path: '',
        name: 'overview',
        component: () => import('~/views/OverView'),
      },
      {
        path: '/clients',
        name: 'clients',
        component: () => import('~/views/DataView'),
      },
      {
        path: '/clients/:id',
        name: 'clientDetails',
        component: () => import('~/views/Clients/ClientsView'),
      },
      {
        path: '/topics',
        name: 'topics',
        component: () => import('~/views/DataView'),
      },
      {
        path: '/subscriptions',
        name: 'subscriptions',
        component: () => import('~/views/DataView'),
      },
      {
        path: '/rules',
        name: 'rules',
        component: () => import('~/views/RuleEngine/Rules'),
      },
      {
        path: '/rules/create',
        name: 'ruleCreate',
        component: () => import('~/views/RuleEngine/RuleCreate'),
      },
      {
        path: '/rules/:id',
        name: 'ruleDetails',
        component: () => import('~/views/RuleEngine/RuleView'),
      },
      {
        path: '/resources',
        name: 'resources',
        component: () => import('~/views/RuleEngine/Resources'),
      },
      {
        path: '/topic_metrics',
        name: 'topic_metrics',
        component: () => import('~/views/TopicMetrics'),
      },
      {
        path: '/slow_sub',
        name: 'slow_sub',
        component: () => import('~/views/SlowSub'),
      },
      {
        path: '/log_trace',
        name: 'log_trace',
        component: () => import('~/views/LogTrace/LogTrace'),
      },
      {
        path: '/alarms',
        name: 'alarms',
        component: () => import('~/views/Alarms'),
      },
      {
        path: '/plugins',
        name: 'plugins',
        component: () => import('~/views/Plugins/Plugins'),
      },
      {
        path: '/plugins/:pluginName',
        name: 'pluginsName',
        component: () => import('~/views/Plugins/PluginsManage'),
      },
      {
        path: '/modules',
        name: 'modules',
        component: () => import('~/views/Modules'),
      },
      {
        path: '/listeners',
        name: 'listeners',
        component: () => import('~/views/Listeners'),
      },
      {
        path: '/websocket',
        name: 'websocket',
        component: () => import('~/views/WebSocket'),
      },
      {
        path: '/http_api',
        name: 'http_api',
        component: () => import('~/views/HttpApi'),
      },
      {
        path: '/applications',
        name: 'applications',
        component: () => import('~/views/Applications'),
      },
      {
        path: '/users',
        name: 'users',
        component: () => import('~/views/Users'),
        props: true,
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('~/views/Settings'),
      },
      {
        path: '/help',
        name: 'help',
        component: () => import('~/views/Help'),
      },
    ],
  },
  {
    path: '*',
    meta: { requiresAuth: false },
    component: () => import('~/views/NotFound'),
  },
]

const router = new VueRouter({
  routes,
})

router.beforeEach((to, from, next) => {
  const { requiresAuth = true } = to.meta
  if (requiresAuth) {
    if (!store.state.user.password) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    } else {
      if (newFeaturesMenu.indexOf(to.name) > -1) {
        store.dispatch('CANCEL_FEAT_ON_LEFTBAR', to.name)
      }
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
      next()
    }
  } else {
    next()
  }
})

export default router
