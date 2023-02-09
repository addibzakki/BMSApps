export const setWorkScheduleFrom = value => {
  return {type: 'SET_WORK_SCHEDULE_FROM', work_schedule_from: value};
};
export const setWorkScheduleTo = value => {
  return {type: 'SET_WORK_SCHEDULE_TO', work_schedule_to: value};
};

export const setOvertimeProjectionFrom = value => {
  return {type: 'SET_OVERTIME_PROJECTION_FROM', projection_from: value};
};
export const setOvertimeProjectionTo = value => {
  return {type: 'SET_OVERTIME_PROJECTION_TO', projection_to: value};
};
export const clearFormSPL = () => {
  return {type: 'CLEAR_FROM_SPL'};
};
