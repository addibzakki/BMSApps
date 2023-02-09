export const setPreventifState = value => {
  return {type: 'SET_PREVENTIF_STATE', data: value};
};
export const setRefreshKey = value => {
  return {type: 'SET_REFRESH_KEY_PREVENTIF', refreshValue: value};
};
export const clearStatePrevetif = () => {
  return {type: 'CLEAR_STATE_PREVENTIF'};
};
export const setPreventifListDetail = value => {
  return {type: 'SET_PREVENTIF_LIST_DETAIL', list: value};
};
export const setPVChecklistAttr = value => {
  return {type: 'SET_PREVENTIVE_CHECKLIST_ATTRIBUTE', data: value};
};
export const setPVCheckStandartAttr = value => {
  return {
    type: 'SET_PREVENTIVE_CHECK_STANDART_ATTRIBUTE',
    data: value,
  };
};
export const setPVChecklistID = value => {
  return {type: 'SET_PREVENTIVE_CHECKLIST_ID', id: value};
};
export const setPVCheckStandartID = value => {
  return {type: 'SET_PREVENTIVE_CHECK_STANDART_ID', id: value};
};
export const setPVTransCode = value => {
  return {type: 'SET_PREVENTIVE_TRANS_CODE', trans_code: value};
};
