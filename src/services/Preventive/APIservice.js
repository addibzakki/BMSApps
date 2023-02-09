import axios from 'axios';

// function api for modul corrective

const PreventiveAPIService = {
  // GET
  getAllChecklist: function(params) {
    return axios.get(
      'http://api.mmproperty.com/preventive-maintenances/' +
        params +
        '/check-list',
    );
  },

  getAllCheckStandart: function(params) {
    return axios.get(
      'http://api.mmproperty.com/preventive-maintenances/' +
        params +
        '/details',
    );
  },

  getAllCheckStandarByTransCode: function(params) {
    return axios.get(
      'http://api.mmproperty.com/preventive-maintenances/histories/' +
        params +
        '/check-lists',
    );
  },
};

export default PreventiveAPIService;
