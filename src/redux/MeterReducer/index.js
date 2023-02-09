const initialStateTenant = {
  info: [],
  meterID: '',
  meterInfo: [],
  lastReading: [],
  summary: [],
};

const MeterReducer = (state = initialStateTenant, action) => {
  switch (action.type) {
    case 'SET_TENANT':
      return {
        ...state,
        info: action.info,
      };
    case 'SET_METERID':
      return {
        ...state,
        meterID: action.meterID,
      };
    case 'SET_INFO_METER':
      return {
        ...state,
        meterInfo: action.meterInfo,
      };
    case 'CLEAR_METERID':
      return {
        ...state,
        meterID: action.meterID,
      };
    case 'SET_LAST_READING_METER':
      return {
        ...state,
        lastReading: action.lastReading,
      };
    case 'SET_INFO_SUMMARY':
      return {
        ...state,
        summary: action.summary,
      };
  }

  return state;
};

export default MeterReducer;
