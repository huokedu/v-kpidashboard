import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appSettings: {}
  },

  getters: {
    settings: state => {
      if (Object.keys(state.appSettings).length) {
        return { ...state.appSettings }
      }
      return ''
    }
  },

  mutations: {
    updateSettings (state, settings) {
      state.appSettings = { ...state.appSettings, ...settings }
    }
  },

  actions: {
    getSettings (context, payload) {
      let wellID = ''
      let wellboreID = ''
      if (payload && payload.$route) {
        wellID = payload.$route.query.wellID || wellID
        wellboreID = payload.$route.query.wellboreID || wellboreID
      }
      axios
      .get('/api/appsettings')
      .then(res => {
        res.data.wellID = wellID || res.data.debugWellID
        res.data.wellboreID = wellboreID || ''
        context.commit('updateSettings', res.data)
      })
      .catch(err => console.log(err))
    }
  }
})
