import axios from '../axios';
// function api for modul corrective

const SPLAPIService = {
  // POST
  submitSPL: function(params) {
    return axios.post('/submit_spl', params);
  },
  processGetTicketSPL: function(params) {
    return axios.post('/get_ticket_spl', params);
  },
  processGetDetailSPL: function(params) {
    return axios.post('/get_detail_spl', params);
  },
  submitConfirmationSPL: function(params) {
    return axios.post('/submit_confirmation_spl', params);
  },
  processGetHistorySPL: function(params) {
    return axios.post('/get_list_spl', params);
  },
  getSPV: function(params) {
    return axios.post('/get_list_engineer_spl', params);
  },
  getLocation: function(params) {
    return axios.post('/get_list_location_spl', params);
  },
  getOutstandingSPL: function(params) {
    return axios.post('/check_outstanding_spl', params);
  },
  submitResultSPL: function(params) {
    return axios.post('/submit_result_spl', params);
  },

  // GET
};

export default SPLAPIService;
