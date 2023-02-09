import axios from '../axios';
const WorkAreaAPIService = {
  checkoutArea: function(params) {
    return axios.post('/checkout_work_area', params);
  },
  checkDataArea: function(params) {
    return axios.post('/check_work_area', params);
  },
  submitWorkArea: function(params) {
    return axios.post('/store_work_area', params);
  },
  getWorkArea: function(params) {
    return axios.post('/get_work_area', params);
  },
};

export default WorkAreaAPIService;
