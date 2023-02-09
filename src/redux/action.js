export const setToken = (inputType, value) => {
  return {type: 'SET_TOKEN', inputType: inputType, inputValue: value};
};

export const setForm = value => {
  // return {type: 'SET_FORM', inputType: inputType, inputValue: value};
  return {type: 'SET_FORM', profile: value};
};

export const setInfo = value => {
  return {type: 'SET_INFO', info: value};
};

export const setIntro = () => {
  return {type: 'SET_INTRO'};
};

export const setBackIntro = () => {
  return {type: 'SET_BACK_INTRO'};
};

export const authLogin = () => {
  return {type: 'AUTH_LOGIN'};
};

export const clearToken = () => {
  return {type: 'CLEAR_TOKEN'};
};

export const authLogOut = () => {
  return {type: 'AUTH_LOGOUT'};
};

export const setArea = (value, available) => {
  return {type: 'SET_AREA', item: value, available: available};
};

export const clearArea = () => {
  return {type: 'CLEAR_AREA'};
};

export const setProfileId = value => {
  return {type: 'SET_PROFILE_ID', profile_id: value};
};

export const clearProfileId = () => {
  return {type: 'CLEAR_PROFILE_ID'};
};