import axios from '../axiosPreventive';
const PreventiveAPIService = {
  getAllChecklist: function(params) {
    return axios.get('/preventive-maintenances/' + params + '/check-list');
  },

  getAllCheckStandart: function(params) {
    return axios.get('/preventive-maintenances/' + params + '/details');
  },

  getAllCheckStandarByTransCode: function(params) {
    return axios.get(
      '/preventive-maintenances/histories/' + params + '/check-lists',
    );
  },
  // POST
  submitPhotoBeforePreventif: function(params) {
    return axios.post(
      '/preventive-maintenances/' + params[0] + '/upload-before',
      params[1],
    );
  },
  updateStatusDetailPreventif: function(params) {
    return axios.post(
      '/preventive-maintenances/details/' + params[0],
      params[1],
    );
  },

  submitHeaderPreventif: function(params) {
    return axios.post(
      '/preventive-maintenances/' + params[0] + '/submit',
      params[1],
    );
  },
  submitPartialPreventif: function(params) {
    return axios.post(
      '/preventive-maintenances/' + params[0] + '/submit-partial',
      params[1],
    );
  },
  submitToChangeAndSumStatus: function(params) {
    return axios.post(
      '/preventive-maintenances/' + params + '/submit-partial-final',
      [],
    );
  },
  approveSubmitPreventive: function(params) {
    return axios.post('/preventives/approve', params);
  },
  rejectSubmitPreventive: function(params) {
    return axios.post('/preventives/rejected', params);
  },
  submitToCorrectiveFromPreventif: function(params) {
    return axios.post(
      '/preventive-maintenances/' + params[0] + '/corrective',
      params[1],
    );
  },

  // PATCH
  submitApprovePreventifToCorrective: function(params) {
    return axios.patch('/wait-corrective/' + params + '/submit');
  },
  submitRejectPreventifToCorrective: function(params) {
    return axios.patch('/wait-corrective/' + params + '/reject-corrective');
  },

  // GET
  getListPreventif: function(params) {
    return axios.get('/preventive-maintenances?' + params);
  },
  getListHistoryPreventif: function(params) {
    return axios.get('/preventive-maintenances/histories?' + params);
  },
  getItemPreventif: function(params) {
    return axios.get('/preventive-maintenances/' + params);
  },
  getListPreventifToCorrective: function(params) {
    return axios.get('/wait-corrective?' + params);
  },
  getListPreventifSubmitList: function(params) {
    return axios.get('/preventives/approve?' + params);
  },
  getImageFromPreventive: function(params) {
    return axios.get('/preventive-maintenances/image-befores/' + params);
  },
  getListAssetHistory: function (params) {
    return axios.get('/preventive-maintenances/histories/asset/' + params);
  },
};

export default PreventiveAPIService;
