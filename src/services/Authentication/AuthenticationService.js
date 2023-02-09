import axios from '../axios';
const AuthenticationAPIService = {
  changePassword: function(params) {
    return axios.post('/change_password', params);
  },
  login: function(params) {
    return axios.post('/login', params);
  },
};

export default AuthenticationAPIService;
