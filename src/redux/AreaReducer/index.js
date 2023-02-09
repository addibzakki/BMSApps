const initialState = {
  available: false,
  area: [],
};

const AreaReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_AREA':
      return {
        ...state,
        available: action.available,
        area: action.item,
      };
    case 'CLEAR_AREA':
      return {
        ...state,
        available: false,
        area: [],
      };
  }

  return state;
};

export default AreaReducer;
