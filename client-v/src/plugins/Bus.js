export default {
  install (Vue, options) {
    Vue.prototype.$bus = new Vue()
    Vue.prototype.$bus.on = Vue.prototype.$bus.$on
    Vue.prototype.$bus.emit = Vue.prototype.$bus.$emit
    Vue.prototype.E_SETTINGS = 'E_SETTINGS'
  }
}
