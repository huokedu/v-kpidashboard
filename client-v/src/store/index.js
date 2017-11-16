import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const state = {
  appSettings: {}
}

const getters = {
  settings: state => Object.keys(state.appSettings).length ? { ...state.appSettings } : ''
}

const mutations = {
  updateSettings: (state, settings) => {
    state.appSettings = { ...state.appSettings, ...settings }
    return state.appSettings
  }
}

const actions = {
  getSettings (context, payload) {
    axios
      .get('/api/appsettings')
      .then(res => {
        if (payload && payload.$route) {
          res.data.wellID = payload.$route.query.wellID || res.data.debugWellID
          res.data.wellboreID = payload.$route.query.wellboreID || ''
        }

        context.commit('updateSettings', res.data)
        if (payload && payload.$bus) {
          payload.$bus.emit(payload.$bus.E_SETTINGS, res.data)
        }
      })
      .catch(err => console.log(err))
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
