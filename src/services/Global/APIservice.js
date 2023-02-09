import axios from 'axios';

// function api for GLOBAL
const GlobalAPIService = {
  fetchListUser: function(params) {
    return axios.get('https://mynet.mmproperty.com/api/fetch_list_user_dev');
  },
  fetchListWorkArea: function(params) {
    return axios.post(
      'https://mynet.mmproperty.com/api/fetch_list_work_area_dev',
      params,
    );
  },
};

export default GlobalAPIService;
