import axios from '../axios';
// * function api for Notification
const NotificationAPIService = {
  getSubscribed: function(params) {
    return axios.post('/unsubscribed_notif', params);
  },
};

export default NotificationAPIService;
