import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Performance from '@/views/Performance'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/performance' },
    { path: '/performance', name: 'performance-view', component: Performance },
    { path: '/qcview', name: 'hello', component: HelloWorld }
  ]
})
