import Vue from 'vue'
import Router from 'vue-router'
import PerformanceView from '@/views/PerformanceView'
import QCView from '@/views/QCView'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/performance' },
    { path: '/performance', name: 'performance-view', component: PerformanceView },
    { path: '/qcview', name: 'qc-view', component: QCView }
  ]
})
