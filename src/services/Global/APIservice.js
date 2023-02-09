import axios from '../axios';

// function api for GLOBAL
const GlobalAPIService = {
  fetchListUser: function(params) {
    return axios.get('/fetch_list_user');
  },
  fetchListWorkArea: function(params) {
    return axios.post('/fetch_list_work_area', params);
  },
};

export default GlobalAPIService;
