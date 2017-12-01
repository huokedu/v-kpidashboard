const getters = {
    settings: state => Object.keys(state.appSettings).length ? { ...state.appSettings } : '',
    footage: state => state.footageData.length ? [...state.footageData] : [],
    rigInfo: state => Object.keys(state.rigInfoData).length ? { ...state.rigInfoData } : '',
    wellInfo: state => Object.keys(state.wellInfoData).length ? { ...state.wellInfoData } : '',
    projected: state => Object.keys(state.projectedData).length ? { ...state.projectedData } : '',
    target: state => Object.keys(state.targetData).length ? { ...state.targetData } : ''
}

export default getters;
