const initialState = {
  attribute: [],
  refreshKey: false,
  list: [],
  checklist: [],
  check_standart: [],
  checklist_id: '',
  checkstandart_id: '',
  trans_code: '',
};

const PreventifReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PREVENTIF_STATE':
      return {
        ...state,
        attribute: action.data,
      };
    case 'SET_REFRESH_KEY_PREVENTIF':
      return {
        ...state,
        refreshKey: action.refreshValue,
      };
    case 'CLEAR_STATE_PREVENTIF':
      return {
        ...state,
        attribute: [],
      };
    case 'SET_PREVENTIF_LIST_DETAIL':
      return {
        ...state,
        list: action.list,
      };
    case 'SET_PREVENTIVE_CHECKLIST_ATTRIBUTE':
      return {
        ...state,
        checklist: action.data,
      };
    case 'SET_PREVENTIVE_CHECK_STANDART_ATTRIBUTE':
      return {
        ...state,
        check_standart: action.data,
      };
    case 'SET_PREVENTIVE_CHECKLIST_ID':
      return {
        ...state,
        checklist_id: action.id,
      };
    case 'SET_PREVENTIVE_CHECK_STANDART_ID':
      return {
        ...state,
        checkstandart_id: action.id,
      };
    case 'SET_PREVENTIVE_TRANS_CODE':
      return {
        ...state,
        trans_code: action.trans_code,
      };
  }

  return state;
};

export default PreventifReducer;
