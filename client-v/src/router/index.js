import Vue from 'vue'
import Router from 'vue-router'
import PerformanceView from '@/views/Performance-view'
import QCView from '@/views/qc-view'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/performance' },
    { path: '/performance', name: 'performance-view', component: PerformanceView },
    { path: '/qcview', name: 'qc-view', component: QCView }
  ]
})
