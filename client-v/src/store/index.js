import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appsettings: {},
    urlparams: {}
  },

  getters: {
    settings: state => { return { ...state.appsettings, ...state.urlparams } }
  },

  mutations: {
    updateAppSettings (state, appsettings) {
      state.appsettings = { ...state.appsettings, ...appsettings }
    },

    updateURLParams (state, urlparams) {
      state.urlparams = { ...state.urlparams, ...urlparams }
    }
  },

  actions: {
    getAppSettings (context) {
      axios
        .get('/api/appsettings')
        .then(res => {
          context.commit('updateAppSettings', res.data)
        })
        .catch(err => console.log(err))
    }
  }
})
