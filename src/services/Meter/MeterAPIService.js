import axios from '../axios';
const MeterAPIService = {
  //* for get method
  fetchListMeterOffline: function(params) {
    return axios.get('/list_meter_offline');
  },
  getMeter: function(params) {
    return axios.get('/get_meter/' + params);
  },
  getMeterMaster: function(params) {
    return axios.get('/get_meter_master/' + params);
  },
  getTenantList: function(params) {
    return axios.get('get_tenant/list');
  },

  //* for post method
  createReadingMeter: function(params) {
    return axios.post('/create_reading_meter', params);
  },
  createReadingMeterMaster: function(params) {
    return axios.post('/create_reading_meter_master', params);
  },
};

export default MeterAPIService;
