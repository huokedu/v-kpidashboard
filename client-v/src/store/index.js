import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { RIGSTATE } from '@/util'

Vue.use(Vuex)

const state = {
  appSettings: {},
  footageData: [],
  rigInfoData: {
    rigState: '--',
    bitDepth: '--',
    holeDepth: '--',
    bitDepthUnit: 'ft',
    holeDepthUnit: 'ft',
    holeDepthTime: ''
  },
  wellInfoData: {},
  projectedData: {}
}

const getters = {
  settings: state => Object.keys(state.appSettings).length ? { ...state.appSettings } : '',
  footage: state => state.footageData.length ? [...state.footageData] : [],
  rigInfo: state => Object.keys(state.rigInfoData).length ? { ...state.rigInfoData } : '',
  wellInfo: state => Object.keys(state.wellInfoData).length ? { ...state.wellInfoData } : '',
  projected: state => Object.keys(state.projectedData).length ? { ...state.projectedData } : ''
}

const mutations = {
  updateSettings: (state, settings) => {
    state.appSettings = { ...state.appSettings, ...settings }
    return state.appSettings;
  },

  updateFootage: (state, footageData) => {
    state.footageData = [...footageData];
    return state.footageData;
  },

  updateRigInfo: (state, rigInfoData) => {
    state.rigInfoData = { ...rigInfoData };
    return state.rigInfoData;
  },

  updateWellInfo: (state, wellInfoData) => {
    state.wellInfoData = { ...wellInfoData };
    return state.wellInfoData;
  },

  updateProject: (state, projectedData) => {
    state.projectedData = { ...projectedData };
    return state.projectedData;
  }
}

const actions = {
  getSettings(context, payload) {
    axios.get('/api/appsettings')
      .then(res => {
        if (payload && payload.$route) {
          res.data.wellID = payload.$route.query.wellID || res.data.debugWellID;
          res.data.wellboreID = payload.$route.query.wellboreID || '';
        }

        context.commit('updateSettings', res.data);
        if (payload && payload.$bus) {
          payload.$bus.emit(payload.$bus.E_SETTINGS, res.data);
        }
      })
      .catch(err => console.log(err))
  },

  getFootage(context, payload) {
    let url = context.getters.settings['Uri-Slb.Prism.Rhapsody.Service.FootageProjection-1'] + '/dailyperf';
    axios.post(url, payload)
      .then(res => {
        if (res && res.data) {
          context.commit('updateFootage', res.data);
        }
      })
      .catch(err => console.log(err));
  },

  getRigInfo(context, payload) {
    let url = context.getters.settings['Uri-Slb.Prism.RO.Service.DrillingApi.TimeData-1'] + '/2015/TimeData/GetLastValue';
    axios
      .post(url, payload)
      .then((res) => {
        if (res && res.data) {
          let rigInfo = { ...context.getters.rigInfo };
          for (let c of res.data['lastValues']) {
            if (c['mnemonic'] === 'DrillBoreHole.TD' && c['value']['value']) {
              rigInfo.holeDepth = c['value']['value'].toFixed(2);
              rigInfo.holeDepthTime = c['value']['time'];
            }
            if (c['mnemonic'] === 'DepthMonitoring.RBD' && c['value']['value']) {
              rigInfo.bitDepth = c['value']['value'].toFixed(2);
            }
            if (c['mnemonic'] === 'DepthMonitoring.ACTIVITY') {
              rigInfo.rigState = RIGSTATE[c['value']['value']] || '--';
            }
          }
          context.commit('updateRigInfo', rigInfo);
        }
      })
      .catch(err => console.log(err));
  },

  getWellInfo(context, payload) {
    let url = context.getters.settings['Uri-Slb.Prism.Core.Service.Well-1'] + '/' + context.getters.settings.wellID;
    axios
      .get(url)
      .then((res) => {
        if (res && res.data && res.data.data) {
          let name = res.data.data.match(/<eml:Title>(.+?)<\/eml:Title>/);
          let timeZone = res.data.data.match(/<witsml:TimeZone>(.+?)<\/witsml:TimeZone>/);
          let timeZoneH = parseInt(timeZone[1].split(':')[0]);
          let timeZoneM = parseInt(timeZone[1].split(':')[1]);
          let wellInfo = {
            wellname: name ? name[1] : '',
            rigTimezone: timeZoneH > 0 ? timeZoneH + timeZoneM / 60 : timeZoneH - timeZoneM / 60
          };
          context.commit('updateWellInfo', wellInfo)
        }
      })
      .catch(err => console.log(err));
  },

  getProjected(context, payload) {
    let url = context.getters.settings['Uri-Slb.Prism.Rhapsody.Service.FootageProjection-1'] + '/projection?model.wellId=' + context.getters.settings.wellID;
    axios
      .get(url)
      .then((res) => {
        if (res && res.data) {
          context.commit('updateProject', res.data);
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
