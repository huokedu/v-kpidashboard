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
    },

    updateTarget: (state, targetData) => {
        state.targetData = { ...targetData };
        return state.targetData;
    }
}

export default mutations;
