import axios from '../axios';
const DashboardAPIService = {
  getPoint: function(params) {
    return axios.get('/get_point/' + params).catch(function(error) {
      console.log(error);
    });
  },

  getVersion: function(params) {
    return axios.get('/get_version/' + params).catch(function(error) {
      console.log(error);
    });
  },
  // POST
  getDashboard: function(params) {
    return axios.post('/get_data_dashboard', params).catch(function(error) {
      console.log(error);
    });
  },
  fetchListMenu: function(params) {
    return axios.post('/global/fetch_list_menu', params).catch(function(error) {
      console.log(error);
    });
  },
};

export default DashboardAPIService;
