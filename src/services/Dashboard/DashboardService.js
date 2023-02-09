import axios from '../axios';
const DashboardAPIService = {
  getPoint: function(params) {
    return axios.get('/get_point/' + params);
  },

  getVersion: function(params) {
    return axios.get('/get_version/' + params);
  },
  // POST
  getDashboard: function(params) {
    return axios.post('/get_data_dashboard', params);
  },
  fetchListMenu: function(params) {
    return axios.post('/global/fetch_list_menu', params);
  },
};

export default DashboardAPIService;
