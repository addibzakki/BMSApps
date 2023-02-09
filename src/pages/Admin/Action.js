// TODO : SET TENANT METER
export const setInfoTenant = value => {
  return {type: 'SET_TENANT', info: value};
};
export const setInfoMeterID = value => {
  return {type: 'SET_METERID', meterID: value};
};
export const setInfoMeter = value => {
  return {type: 'SET_INFO_METER', meterInfo: value};
};
export const clearInfoMeterID = value => {
  return {type: 'CLEAR_METERID', meterID: ''};
};
export const setLastReadingMeter = value => {
  return {type: 'SET_LAST_READING_METER', lastReading: value};
};
export const setInfoSummary = value => {
  return {type: 'SET_INFO_SUMMARY', summary: value};
};
export const setListState = value => {
  return {type: 'SET_LIST_STATE', status: value};
};
export const setTicketNo = value => {
  return {type: 'SET_TICKET_NO', ticket_no: value};
};
