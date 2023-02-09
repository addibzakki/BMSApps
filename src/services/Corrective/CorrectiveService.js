import axios from '../axios';
import axios_preventive from '../axiosPreventive';
const CorrectiveAPIService = {
  // POST
  getSubMenuTicket: function(params) {
    return axios.post('/get_list_status', params);
  },
  fetchListAction: function(params) {
    return axios.post('/fetch_list_action', params);
  },
  fetchListAssignmentPIC: function(params) {
    return axios.post('/fetch_list_assignment_pic', params);
  },
  getSupervisor: function(params) {
    return axios.post('/get_list_engineer', params);
  },
  getListEngineerCorrective: function(params) {
    return axios.post('/get_list_engineer', params);
  },
  submitAssignmentCorrective: function(params) {
    return axios.post('/submit_assignment', params);
  },
  getListTicket: function(params) {
    return axios.post('/get_list_assignment', params);
  },

  fetchListTicketPIC: function(params) {
    return axios.post('/fetch_list_ticket_pic', params);
  },
  getListItemCorrective: function(params) {
    return axios.post('/get_list_item', params);
  },
  submitSearchItemCorrective: function(params) {
    return axios.post('/search_item', params);
  },
  submitConfirmItemCorrective: function(params) {
    return axios.post('/update_confirm_item', params);
  },
  submitHoldTicketCorrective: function(params) {
    return axios.post('/hold_ticket', params);
  },
  submitActivityTakenCorrective: function(params) {
    return axios.post('/create_activity_taken', params);
  },
  updateActivityTakenCorrective: function(params) {
    return axios.post('/update_activity_taken', params);
  },
  submitUpdateStatusCorrective: function(params) {
    return axios.post('/update_status_ticket', params);
  },
  submitRequestTransferCorrective: function(params) {
    return axios.post('/request_transfer', params);
  },
  submitActionAssignmentCorrective: function(params) {
    return axios.post('/action_assignment', params);
  },

  // GET
  getListType: function(params) {
    return axios.get('/get_list_type/' + params);
  },
  getListPriority: function(params) {
    return axios.get('/get_list_priority');
  },
  getEngineer: function(params) {
    return axios.get('/get_ticket_engineer/' + params);
  },
  getTotalCorrective: function(params) {
    return axios.get('/get_total_corrective/' + params[0] + '/' + params[1]);
  },
  getOnhandQty: function(params) {
    return axios.get('/get_onhand_qty/' + params[0] + '/' + params[1]);
  },
  getTicketHistory: function(params) {
    return axios.get(
      '/get_ticket_history_engineer/' + params.uid + '/' + params.level,
    );
  },
  fetchListItem: function(params) {
    return axios.get('/fetch_list_po_item');
  },
  fetchListOnHand: function(params) {
    return axios.get('/fetch_list_on_hand', params);
  },
  getImageFromPreventive: function(params) {
    return axios_preventive.get(
      'preventive-maintenances/image-befores/' + params,
    );
  },
  getListActivityCorrective: function(params) {
    return axios.get('/get_list_activity/' + params);
  },
  getListCategory: function(params) {
    return axios.get('/get_list_category/' + params);
  },
};

export default CorrectiveAPIService;
