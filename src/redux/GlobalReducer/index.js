const initialState = {
  loading: false,
  refresh: false,
};

const GlobalReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.set,
      };
    case 'SET_REFRESH':
      return {
        ...state,
        refresh: action.set,
      };
  }

  return state;
};

export default GlobalReducer;
