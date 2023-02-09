import axios from 'axios';
const APIService = {
  // POST
  submitPhotoBeforePreventif: function(params) {
    return axios.post(
      'http://api.mmproperty.com/preventive-maintenances/' +
        params[0] +
        '/upload-before',
      params[1],
    );
  },
  updateStatusDetailPreventif: function(params) {
    return axios.post(
      'http://api.mmproperty.com/preventive-maintenances/details/' + params[0],
      params[1],
    );
  },

  submitHeaderPreventif: function(params) {
    return axios.post(
      'http://api.mmproperty.com/preventive-maintenances/' +
        params[0] +
        '/submit',
      params[1],
    );
  },
  approveSubmitPreventive: function(params) {
    return axios.post('http://api.mmproperty.com/preventives/approve', params);
  },
  rejectSubmitPreventive: function(params) {
    return axios.post('http://api.mmproperty.com/preventives/rejected', params);
  },
  submitToCorrectiveFromPreventif: function(params) {
    return axios.post(
      'http://api.mmproperty.com/preventive-maintenances/' +
        params[0] +
        '/corrective',
      params[1],
    );
  },

  // PATCH
  submitApprovePreventifToCorrective: function(params) {
    return axios.patch(
      'http://api.mmproperty.com/wait-corrective/' + params + '/submit',
    );
  },
  submitRejectPreventifToCorrective: function(params) {
    return axios.patch(
      'http://api.mmproperty.com/wait-corrective/' +
        params +
        '/reject-corrective',
    );
  },

  // GET

  getListPreventif: function(params) {
    return axios.get(
      'http://api.mmproperty.com/preventive-maintenances?' + params,
    );
  },
  getListHistoryPreventif: function(params) {
    return axios.get(
      'http://api.mmproperty.com/preventive-maintenances/histories?' + params,
    );
  },
  getItemPreventif: function(params) {
    return axios.get(
      'http://api.mmproperty.com/preventive-maintenances/' + params,
    );
  },

  getListPreventifToCorrective: function(params) {
    return axios.get(
      'http://api.mmproperty.com/wait-corrective?is_corrective=0',
    );
  },
  getListPreventifSubmitList: function(params) {
    return axios.get('http://api.mmproperty.com/preventives/approve');
  },
};

export default APIService;
