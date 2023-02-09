const initialState = {
  profile_id: '',
};

const ProfileIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PROFILE_ID':
      return {
        ...state,
        profile_id: action.profile_id,
      };
    case 'CLEAR_PROFILE_ID':
      return {
        ...state,
        profile_id: '',
      };
  }

  return state;
};

export default ProfileIdReducer;
