import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const state = {
  appSettings: {},
  footageData: {},
  rigInfoData: {}
}

const getters = {
  settings: state => Object.keys(state.appSettings).length ? { ...state.appSettings } : '',
  footage: state => Object.keys(state.footageData).length ? { ...state.footageData } : '',
  rigInfo: state => Object.keys(state.rigInfoData).length ? { ...state.rigInfoData } : ''
}

const mutations = {
  updateSettings: (state, settings) => {
    state.appSettings = { ...state.appSettings, ...settings }
    return state.appSettings;
  },

  updateFootage: (state, footageData) => {
    state.footageData = { ...footageData };
    return state.footageData;
  },

  updateRigInfo: (state, rigInfoData) => {
    state.rigInfoData = { ...rigInfoData };
    return state.rigInfoData;
  }
}

const actions = {
  getSettings(context, payload) {
    axios.get('/api/appsettings')
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
  },

  getFootage(context, payload) {
    let url = context.getters.settings['Uri-Slb.Prism.Rhapsody.Service.FootageProjection-1'];
    if (!url) {
      console.log('invalid footage service url');
      return;
    }
    axios.post(url, payload)
      .then(res => {
        if (res && res.data) {
          console.log(res.data);
          context.commit('updateFootage', res.data)
        }
      })
      .catch(err => console.log(err));
  },

  getRigInfo(context, payload) {
    let url = context.getters.settings['Uri-Slb.Prism.RO.Service.DrillingApi.TimeData-1'] + '/2015/TimeData/GetLastValue';
    if (!url) {
      console.log('invalid time data service url');
      return;
    }
    axios
    .post(url, payload)
    .then((wellinfo) => {
      if (wellinfo && wellinfo.data) {
        context.commit('updateRigInfo', wellinfo.data)
      }
    })
    .catch(err => console.log(err));
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
