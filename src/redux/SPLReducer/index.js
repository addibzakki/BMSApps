const initialState = {
  work_schedule_from: '',
  work_schedule_to: '',
  projection_from: '',
  projection_to: '',
};

const SPLReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_WORK_SCHEDULE_FROM':
      return {
        ...state,
        work_schedule_to: action.work_schedule_to,
      };
    case 'SET_WORK_SCHEDULE_TO':
      return {
        ...state,
        work_schedule_from: action.work_schedule_from,
      };
    case 'SET_OVERTIME_PROJECTION_FROM':
      return {
        ...state,
        projection_from: action.projection_from,
      };
    case 'SET_OVERTIME_PROJECTION_TO':
      return {
        ...state,
        projection_to: action.projection_to,
      };
    case 'CLEAR_FORM_SPL':
      return {
        ...state,
        work_schedule_from: '',
        work_schedule_to: '',
        projection_from: '',
        projection_to: '',
      };
  }

  return state;
};

export default SPLReducer;
